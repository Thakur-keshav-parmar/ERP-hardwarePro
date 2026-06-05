const { DynamoDBClient, ScanCommand, PutItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE = "HardwareProStockLogs";

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
};

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

    try {
        if (event.httpMethod === "GET") {
            const params = event.queryStringParameters || {};
            let items;

            if (params.productId) {
                const result = await client.send(new QueryCommand({
                    TableName: TABLE,
                    IndexName: "productId-timestamp-index",
                    KeyConditionExpression: "productId = :pid",
                    ExpressionAttributeValues: { ":pid": { S: params.productId } },
                    ScanIndexForward: false,
                    Limit: 100
                }));
                items = (result.Items || []).map(unmarshall);
            } else {
                const result = await client.send(new ScanCommand({ TableName: TABLE }));
                items = (result.Items || []).map(unmarshall);
                items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                if (params.limit) items = items.slice(0, parseInt(params.limit));
            }

            return { statusCode: 200, headers, body: JSON.stringify(items) };
        }

        if (event.httpMethod === "POST") {
            const body = JSON.parse(event.body || "{}");
            const entries = Array.isArray(body) ? body : [body];
            const timestamp = new Date().toISOString();

            for (const entry of entries) {
                const logId = "SL" + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase();
                const item = {
                    logId,
                    productId: String(entry.productId || ""),
                    productName: String(entry.productName || ""),
                    action: String(entry.action || "adjustment"),
                    quantityChange: Number(entry.quantityChange || 0),
                    previousStock: Number(entry.previousStock || 0),
                    newStock: Number(entry.newStock || 0),
                    performedBy: String(entry.performedBy || "system"),
                    timestamp: entry.timestamp || timestamp,
                    note: String(entry.note || ""),
                    billId: String(entry.billId || "")
                };
                await client.send(new PutItemCommand({ TableName: TABLE, Item: marshall(item) }));
            }

            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
};
