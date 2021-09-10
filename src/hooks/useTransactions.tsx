import { createContext,ReactNode,useContext,useEffect,useState,} from "react";

import { api } from "../services/api";

interface Transaction {
	id: number;
	title: string;
	type: string;
	category: string;
	amount: number;
	createdAt: string;
}

type TransactionInput = Omit<Transaction, "id" | "createdAt" >;

interface TransactionsProviderProps {
	//ReactNode e um componentes que serve para aceitar qualque tipo de dado
	children: ReactNode;
}

interface TransactionsContextData {
	transactions: Transaction[];
	createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>(
	{} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
	//O set state serve para controlar o valor da constante 
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	//Esse executa assim quando abre a pagina,são os dados iniciais
	//isso acontece pq não tem nenhum parametro no array do useEffectx
	useEffect(() => {
		api.get("transactions").then((res) =>
			setTransactions(res.data.transactions)
		);
	}, []);

	//Essa função e executada toda vez que e fechado o modal
	async function createTransaction(transactionInput: TransactionInput) {
		//adiciona dados a api
		const response = await api.post("/transactions", {
			...transactionInput,
			createdAt: new Date(),
		});
		// response.data e todos os dados que serão inseridos
		const { transaction } = response.data;
		//envia dados para front end
		setTransactions([...transactions, transaction]);
		
	}

	return (
		<TransactionsContext.Provider
			value={{ transactions, createTransaction }}
		>
			{children}
		</TransactionsContext.Provider>
	);
}

export function useTransactions() {
	const context = useContext(TransactionsContext);
	return context;
}
