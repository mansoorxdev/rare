use anchor_lang::prelude::*;

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
    pub const LEN: usize = 8 + // discriminator
        32 + // admin
        32 + // treasury
        8 +  // base_price_lamports
        2 +  // agent_split_bps
        2 +  // treasury_split_bps
        4 +  // total_supply
        4 +  // total_minted
        1 +  // is_paused
        1;   // bump
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
    pub const LEN: usize = 8 + // discriminator
        4 +  // agent_id
        32 + // mint
        32 + // holder
        8 +  // daily_spend_limit_lamports
        8 +  // total_deposited_lamports
        1 +  // is_active
        1;   // bump
}

