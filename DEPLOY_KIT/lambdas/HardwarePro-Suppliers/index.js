const { DynamoDBClient, ScanCommand, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE = "HardwareProSuppliers";

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS"
};

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

    try {
        if (event.httpMethod === "GET") {
            const result = await client.send(new ScanCommand({ TableName: TABLE }));
            const items = (result.Items || []).map(unmarshall);
            items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
            return { statusCode: 200, headers, body: JSON.stringify(items) };
        }

        if (event.httpMethod === "POST") {
            const body = JSON.parse(event.body || "{}");
            const supplierId = body.supplierId || ("SUP" + Date.now());
            const item = {
                supplierId,
                name: String(body.name || ""),
                phone: String(body.phone || ""),
                email: String(body.email || ""),
                address: String(body.address || ""),
                gstin: String(body.gstin || ""),
                categories: String(body.categories || ""),
                createdAt: body.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await client.send(new PutItemCommand({ TableName: TABLE, Item: marshall(item) }));
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, supplierId }) };
        }

        if (event.httpMethod === "DELETE") {
            const supplierId = (event.queryStringParameters || {}).supplierId;
            if (!supplierId) return { statusCode: 400, headers, body: JSON.stringify({ error: "supplierId required" }) };
            await client.send(new DeleteItemCommand({
                TableName: TABLE,
                Key: { supplierId: { S: supplierId } }
            }));
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
};
