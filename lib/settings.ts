const settings = {
	whatsapp: {
		number: "15128013803",
		message:
			"Hello, I am interested in your products from Elevate Motel Supply.",
		url: function () {
			return `https://wa.me/${this.number}?text=${encodeURIComponent(
				this.message
			)}`;
		},
	},
	site: {
		name: "Elevate Motel Supply",
		description:
			"Leading supplier of high-quality motel & hotel furniture, beds, lighting, and essentials. American-focused hospitality solutions with nationwide shipping. Trusted by industry professionals.",
		keywords:
			"motel supplies, hotel furniture, hospitality supplies, hotel beds, motel furniture USA, hotel equipment, commercial hospitality supplies, motel renovation supplies, hotel room furnishings",
		url: "https://www.elevatemotelsupply.com",
		author: "Elevate Motel Supply",
		publisher: "Elevate Motel Supply",
		twitter: "@elevatemotel",
		ogImage: "/images/og-image.jpg",
		twitterImage: "/images/twitter-image.jpg",
		geo: {
			region: "US",
			position: "37.0902;-95.7129",
			icbm: "37.0902, -95.7129",
		},
		verification: {
			google: "google-site-verification-code",
			yandex: "yandex-verification-code",
		},
		analytics_ga_id: "G-PWSQW6TQZ0",
	},
};

export default settings;
