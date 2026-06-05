param($Config, $Kit, $Region)
Write-Host "[2/8] DynamoDB Tables..." -ForegroundColor Cyan

$tables = @(
    @{Name="HardwareProProducts";      Key="productId"},
    @{Name="HardwareProBills";         Key="billId"},
    @{Name="HardwareProUsers";         Key="userId"},
    @{Name="HardwareProSettings";      Key="settingId"},
    @{Name="HardwareProSuppliers";     Key="supplierId"},
    @{Name="HardwareProPurchaseOrders";Key="orderId"},
    @{Name="HardwareProStockLogs";     Key="logId"},
    @{Name="HardwareProChats";         Key="chatId"},
    @{Name="HardwareProTransactions";  Key="transactionId"}
)

foreach ($t in $tables) {
    $exists = aws dynamodb describe-table --table-name $t.Name --query "Table.TableStatus" --output text 2>$null
    if ($exists -match "ACTIVE|CREATING") {
        Write-Host "  Exists: $($t.Name)" -ForegroundColor Gray
    } else {
        aws dynamodb create-table `
            --table-name $t.Name `
            --billing-mode PAY_PER_REQUEST `
            --attribute-definitions AttributeName=$($t.Key),AttributeType=S `
            --key-schema AttributeName=$($t.Key),KeyType=HASH `
            --query "TableDescription.TableStatus" --output text 2>&1 | Out-Null
        Write-Host "  Created: $($t.Name)" -ForegroundColor Green
    }
}
Write-Host "  All 9 DynamoDB tables ready." -ForegroundColor Green
