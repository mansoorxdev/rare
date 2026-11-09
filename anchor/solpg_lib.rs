use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

// This ID is automatically managed by Solana Playground when building/deploying
declare_id!("11111111111111111111111111111111");

#[program]
pub mod rare_protocol {
    use super::*;

    /// Initialize the Protocol Configuration (Admin only)
    pub fn initialize(
        ctx: Context<Initialize>,
        base_price_lamports: u64,
        agent_split_bps: u16,
    ) -> Result<()> {
        require!(agent_split_bps <= 10000, RareError::InvalidSplitBps);

        let config = &mut ctx.accounts.config;
        config.admin = ctx.accounts.admin.key();
        config.treasury = ctx.accounts.treasury.key();
        config.base_price_lamports = base_price_lamports;
        config.agent_split_bps = agent_split_bps;
        config.treasury_split_bps = 10000 - agent_split_bps;
        config.total_supply = 10078;
        config.total_minted = 0;
        config.is_paused = false;
        config.bump = ctx.bumps.config;

        msg!("Rare Protocol Initialized. Total Supply: 10,078");
        msg!("Split: {}% Agent PDA / {}% Treasury", agent_split_bps / 100, (10000 - agent_split_bps) / 100);
        Ok(())
    }

    /// Mint an Autonomous Agent NFT with 90/10 On-Chain Capital Split
    pub fn mint_agent(ctx: Context<MintAgent>, agent_id: u32) -> Result<()> {
        let config = &mut ctx.accounts.config;
        require!(!config.is_paused, RareError::MintingPaused);
        require!(config.total_minted < config.total_supply, RareError::MaxSupplyReached);
        require!(agent_id >= 1 && agent_id <= config.total_supply, RareError::InvalidRareId);

        let price = config.base_price_lamports;

        // Calculate 90/10 Split
        let agent_share = (price as u128 * config.agent_split_bps as u128 / 10000) as u64;
        let treasury_share = price.checked_sub(agent_share).ok_or(RareError::InvalidSplitBps)?;

        // 1. Transfer 10% to Protocol Treasury
        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.treasury.to_account_info(),
                },
            ),
            treasury_share,
        )?;

        // 2. Transfer 90% into the Agent's Dedicated Token-Bound PDA Vault
        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.agent_vault.to_account_info(),
                },
            ),
            agent_share,
        )?;

        // 3. Initialize Agent Vault State
        let vault = &mut ctx.accounts.agent_vault;
        vault.agent_id = agent_id;
        vault.mint = ctx.accounts.mint.key();
        vault.holder = ctx.accounts.buyer.key();
        vault.daily_spend_limit_lamports = 500_000_000; // Default 0.5 SOL
        vault.total_deposited_lamports = agent_share;
        vault.is_active = true;
        vault.bump = ctx.bumps.agent_vault;

        config.total_minted += 1;

        msg!("Agent #{} Minted successfully!", agent_id);
        msg!("90% ({} lamports) deposited to Agent PDA: {}", agent_share, vault.key());
        msg!("10% ({} lamports) sent to Treasury: {}", treasury_share, ctx.accounts.treasury.key());

        Ok(())
    }

    /// Withdraw funds from Agent Vault strictly back to the current NFT holder
    pub fn withdraw_to_holder(ctx: Context<WithdrawToHolder>, amount: u64) -> Result<()> {
        let vault = &ctx.accounts.agent_vault;
        require!(ctx.accounts.holder.key() == vault.holder, RareError::PayoutOnlyToHolder);

        // Vault PDA seeds for signing
        let mint_key = vault.mint;
        let seeds = &[
            b"agent-vault",
            mint_key.as_ref(),
            &[vault.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        **ctx.accounts.agent_vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.holder.to_account_info().try_borrow_mut_lamports()? += amount;

        msg!("Withdrawn {} lamports from Agent #{} to Holder: {}", amount, vault.agent_id, ctx.accounts.holder.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = ProtocolConfig::LEN,
        seeds = [b"rare-config"],
        bump
    )]
    pub config: Account<'info, ProtocolConfig>,

    #[account(mut)]
    pub admin: Signer<'info>,

    /// CHECK: Treasury account to receive 10%
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(agent_id: u32)]
pub struct MintAgent<'info> {
    #[account(
        mut,
        seeds = [b"rare-config"],
        bump = config.bump
    )]
    pub config: Account<'info, ProtocolConfig>,

    /// CHECK: Token Mint of the Agent NFT
    pub mint: AccountInfo<'info>,

    #[account(
        init,
        payer = buyer,
        space = AgentVault::LEN,
        seeds = [b"agent-vault", mint.key().as_ref()],
        bump
    )]
    pub agent_vault: Account<'info, AgentVault>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    /// CHECK: Treasury account validated against config
    #[account(
        mut,
        address = config.treasury @ RareError::InsufficientPayment
    )]
    pub treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawToHolder<'info> {
    #[account(
        mut,
        seeds = [b"agent-vault", agent_vault.mint.as_ref()],
        bump = agent_vault.bump,
        has_one = holder @ RareError::PayoutOnlyToHolder
    )]
    pub agent_vault: Account<'info, AgentVault>,

    #[account(mut)]
    pub holder: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct ProtocolConfig {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub base_price_lamports: u64,
    pub agent_split_bps: u16,     // 9000 bps = 90%
    pub treasury_split_bps: u16,  // 1000 bps = 10%
    pub total_supply: u32,        // 10,078
    pub total_minted: u32,
    pub is_paused: bool,
    pub bump: u8,
}

impl ProtocolConfig {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 2 + 2 + 4 + 4 + 1 + 1;
}

#[account]
pub struct AgentVault {
    pub agent_id: u32,
    pub mint: Pubkey,
    pub holder: Pubkey,
    pub daily_spend_limit_lamports: u64,
    pub total_deposited_lamports: u64,
    pub is_active: bool,
    pub bump: u8,
}

impl AgentVault {
    pub const LEN: usize = 8 + 4 + 32 + 32 + 8 + 8 + 1 + 1;
}

#[error_code]
pub enum RareError {
    #[msg("Protocol minting is currently paused.")]
    MintingPaused,

    #[msg("Total collection supply of 10,078 has been reached.")]
    MaxSupplyReached,

    #[msg("Invalid Rare Agent ID. Must be between 1 and 10,078.")]
    InvalidRareId,

    #[msg("This Rare Agent ID has already been minted.")]
    AgentAlreadyMinted,

    #[msg("Insufficient SOL provided for mint and vault allocation.")]
    InsufficientPayment,

    #[msg("Only the current NFT holder or authorized agent program can interact with this vault.")]
    UnauthorizedAgentAccess,

    #[msg("Agent funds can only be returned to the registered NFT holder.")]
    PayoutOnlyToHolder,

    #[msg("Split percentage calculation overflow or invalid basis points.")]
    InvalidSplitBps,
}

