use ic_cdk::management_canister::raw_rand;

pub async fn generate_unique_id() -> u64 {
    match raw_rand().await {
        Ok(bytes) => {
            // Convert first 8 bytes to u64 for unique ID
            let mut id_bytes = [0u8; 8];
            id_bytes.copy_from_slice(&bytes[..8]);
            u64::from_be_bytes(id_bytes)
        }
        Err(_) => {
            // Fallback to timestamp if random fails
            ic_cdk::api::time()
        }
    }
}
