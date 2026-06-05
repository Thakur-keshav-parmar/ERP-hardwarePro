const { DynamoDBClient, ScanCommand, PutItemCommand, DeleteItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE = "HardwareProPurchaseOrders";

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
};

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

    try {
        if (event.httpMethod === "GET") {
            const result = await client.send(new ScanCommand({ TableName: TABLE }));
            const items = (result.Items || []).map(i => {
                const u = unmarshall(i);
                if (typeof u.items === "string") {
                    try { u.items = JSON.parse(u.items); } catch (_) { u.items = []; }
                }
                return u;
            });
            items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return { statusCode: 200, headers, body: JSON.stringify(items) };
        }

        if (event.httpMethod === "POST") {
            const body = JSON.parse(event.body || "{}");
            const poId = "PO" + Date.now();
            const item = {
                poId,
                supplierId: String(body.supplierId || ""),
                supplierName: String(body.supplierName || ""),
                supplierPhone: String(body.supplierPhone || ""),
                items: JSON.stringify(body.items || []),
                totalAmount: Number(body.totalAmount || 0),
                status: "pending",
                notes: String(body.notes || ""),
                createdBy: String(body.createdBy || "admin"),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                receivedAt: ""
            };
            await client.send(new PutItemCommand({ TableName: TABLE, Item: marshall(item) }));
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, poId }) };
        }

        if (event.httpMethod === "PUT") {
            const body = JSON.parse(event.body || "{}");
            const { poId, status, receivedAt } = body;
            if (!poId) return { statusCode: 400, headers, body: JSON.stringify({ error: "poId required" }) };

            await client.send(new UpdateItemCommand({
                TableName: TABLE,
                Key: { poId: { S: poId } },
                UpdateExpression: "SET #s = :s, updatedAt = :u, receivedAt = :r",
                ExpressionAttributeNames: { "#s": "status" },
                ExpressionAttributeValues: {
                    ":s": { S: status || "pending" },
                    ":u": { S: new Date().toISOString() },
                    ":r": { S: receivedAt || "" }
                }
            }));
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        if (event.httpMethod === "DELETE") {
            const poId = (event.queryStringParameters || {}).poId;
            if (!poId) return { statusCode: 400, headers, body: JSON.stringify({ error: "poId required" }) };
            await client.send(new DeleteItemCommand({
                TableName: TABLE,
                Key: { poId: { S: poId } }
            }));
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
};
