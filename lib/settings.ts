const settings = {
	whatsapp: {
		number: "15128013803",
		message:
			"Hello, I am interested in your educational digital products from NotesNinja.",
		url: function () {
			return `https://wa.me/${this.number}?text=${encodeURIComponent(
				this.message
			)}`;
		},
	},
	site: {
		name: "NotesNinja",
		description:
			"Premium digital academic materials and study resources. Access high-quality notes, study guides, and educational content for students and educators. Instant download, expert-curated content.",
		keywords:
			"digital notes, study materials, academic resources, educational content, study guides, online learning, student resources, digital textbooks, academic notes, exam preparation",
		url: "https://www.notesninja.com",
		author: "NotesNinja",
		publisher: "NotesNinja",
		twitter: "@notesninja",
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
