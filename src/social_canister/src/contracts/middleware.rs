use candid::Principal;
use ic_cdk;
use ic_cdk::{inspect_message};

#[inspect_message]
fn inspect_message() {
    let caller = ic_cdk::api::msg_caller();
    let method_name = ic_cdk::api::msg_method_name();
    // * Block anonymous users from calling any update methods
    if caller == Principal::anonymous() {
        // * Allow query methods for anonymous users, but block update methods
        if is_update_method(&method_name) {
            ic_cdk::api::trap(&format!(
                "Anonymous users cannot call update method: {}",
                method_name
            ));
        }
    }

    ic_cdk::api::accept_message();
}

fn is_update_method(method_name: &str) -> bool {
    // * Check if method follows update patterns
    let update_patterns = [
        "set_", "update_", "create_", "delete_", "add_", "remove_", "join_", "leave_", "save_",
    ];

    update_patterns
        .iter()
        .any(|&pattern| method_name.starts_with(pattern) || method_name.contains(pattern))
}