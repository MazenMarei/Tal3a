mod contracts;
mod services;
mod storage;
mod types;


use ic_cdk;
use ic_cdk::query;

#[query]
fn whoami() -> String {
    ic_cdk::api::msg_caller().to_string()
}



// * export contracts
ic_cdk::export_candid!();