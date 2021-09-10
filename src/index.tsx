import React from "react";
import ReactDOM from "react-dom";
import { createServer, Model } from "miragejs";
import { App } from "./App";

//cria um servidor 
createServer({
	models: {
		transaction: Model,
	},											

	seeds(server) {
		server.db.loadData({
			transactions: [
				{
					id: 2,
					title: "Imposto",
					type: "deposit",
					category: "Casa",
					amount: 10,
					createdAt: new Date("2020-08-10 21:10:40"),
				},
			],
		});
	},

	routes() {
		this.namespace = "api";

		this.get("/transactions", () => {
			return this.schema.all("transaction");
		});
		this.post("/transactions", (schema, request) => {
			const data = JSON.parse(request.requestBody);

			return schema.create("transaction", data);
		});
		this.get("/gracione", () => {
			return [
				{
					id:1,
					title:'frase',
					amount: 400
				}
			]
		});
	},
});

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
