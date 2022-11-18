interface ConfirmSpec {
	title?: string;
	message?: string;
}

interface ConfirmOption {
	text?: string;
	color?: ButtonColor;
	value: any;
	icon?: string;
}

type Confirmation = (content: ConfirmSpec | string, options: ConfirmOption[])=> Promise<any>;