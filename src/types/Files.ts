type Create = { type: "create"; filename: string; base64: string };
type Delete = { type: "delete"; id: number }

export type FileBody = Create | Delete;

