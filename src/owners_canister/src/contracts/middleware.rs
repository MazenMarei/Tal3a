use candid::Principal;
use ic_cdk;
use ic_cdk::inspect_message;

#[inspect_message]
fn inspect_message() {
    ic_cdk::api::debug_print(format!(
        "Inspecting message from: {} , method: {}",
        ic_cdk::api::msg_caller(),
        ic_cdk::api::msg_method_name()
    ));

    let caller = ic_cdk::api::msg_caller();
    let method_name = ic_cdk::api::msg_method_name();
    // * Block anonymous users from calling any update and query methods
    if caller == Principal::anonymous() {
        ic_cdk::api::trap(&format!(
            "Anonymous users cannot call update and query method: {}",
            method_name
        ));
    }

    ic_cdk::api::accept_message();
}
