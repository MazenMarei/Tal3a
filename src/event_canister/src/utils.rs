use ic_cdk::management_canister::raw_rand;

pub async fn generate_unique_id() -> Result<u64, String> {
    raw_rand()
        .await
        .map_err(|e| format!("Random error: {:?}", e))
        .map(|bytes| {
            // Convert first 8 bytes to u64 for unique ID
            let mut id_bytes = [0u8; 8];
            id_bytes.copy_from_slice(&bytes[..8]);
            u64::from_be_bytes(id_bytes)
        })
}
