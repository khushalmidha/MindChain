const deploySoulToken = require("./deploySoulToken");

async function main() {
    // Call the deployment module
    const { soulToken } = await deploySoulToken();

    // Log the deployed contract address
    console.log("SoulToken deployed to:", soulToken.address);
}

// Run the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
