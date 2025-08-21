mod contracts;
mod services;
mod storage;
mod types;

use ic_cdk;

// Export contracts
ic_cdk::export_candid!();
