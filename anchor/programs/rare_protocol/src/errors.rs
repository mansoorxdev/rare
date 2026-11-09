use anchor_lang::prelude::*;

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
