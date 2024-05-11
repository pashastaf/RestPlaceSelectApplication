export type Destination = {
	id: number;
	title: string;
	countries_id: number;
	is_deleted: boolean;
	description: string;
	image_path: string;
};

export type Country = {
	id: number;
	title: string;
};

export type RestPlace = {
	id: number;
	title: string;
};

export type Profile = {
	id: string;
	first_name: string;
	second_name: string;
	email: string;
	group: string;
	avatar_url: string;
	created_at: string;
	serial_num: number;
};

export type Order = {
	id: number;
	profiles_id: number;
	consultants_id: number;
	sale_date: string;
	total_cost: number;
	status: string;
};

export type Service = {
	id: number;
	title: string;
	cost: number;
	comment: string;
};
