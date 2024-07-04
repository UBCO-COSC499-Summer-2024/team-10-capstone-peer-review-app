import {
	CheckCircleIcon,
	XCircleIcon,
	ClockIcon
} from "@heroicons/react/24/outline";

export function getStatusDetails(status) {
	switch (status) {
		case "APPROVED":
			return {
				color: "text-green-500",
				icon: <CheckCircleIcon className="w-4 h-4 text-green-500" />
			};
		case "DENIED":
			return {
				color: "text-red-500",
				icon: <XCircleIcon className="w-4 h-4 text-red-500" />
			};
		case "PENDING":
			return {
				color: "text-yellow-500",
				icon: <ClockIcon className="w-4 h-4 text-yellow-500" />
			};
		default:
			return {
				color: "text-gray-500",
				icon: null
			};
	}
}
