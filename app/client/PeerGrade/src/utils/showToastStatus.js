import { toast } from "../components/ui/use-toast";

const showStatusToast = ({ status, message }) => {
	let variant = "neutral"; // default style
	if (status === "Success") {
		variant = "positive";
	} else if (status === "Error" || status === "Server Fail") {
		variant = "destructive";
	}
	// Not sure if this will work without the hook?
	toast({
		title: status,
		description: message,
		variant: variant
	});
};

export default showStatusToast;
