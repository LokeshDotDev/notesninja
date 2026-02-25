const settings = {
	whatsapp: {
		number: "916378990158",
		message:
			"Hello, I am interested in your educational digital products from NotesNinja.",
		url: function () {
			return `https://wa.me/${this.number}?text=${encodeURIComponent(
				this.message
			)}`;
		},
	},
	site: {
		name: "MUJ Notes | Manipal University Jaipur Study Material, PYQs & Exam Notes – Notes Ninja",
		description:
			"Download MUJ Notes and Manipal University Jaipur study material, including PYQs and structured exam resources for BBA, BCA, B.Com, MBA and more.",
		keywords:
			"digital notes, study materials, academic resources, educational content, study guides, online learning, student resources, digital textbooks, academic notes, exam preparation",
		url: "https://notesninja.com",
		author: "NotesNinja",
		publisher: "NotesNinja",
		twitter: "@notesninja",
		ogImage: "/images/og-image.jpg",
		twitterImage: "/images/twitter-image.jpg",
		geo: {
			region: "IN",
			position: "20.5937;78.9629",
			icbm: "20.5937, 78.9629",
		},
		verification: {
			google: "google-site-verification-code",
			yandex: "yandex-verification-code",
		},
		analytics_ga_id: "G-RHBBN9K8D8",
	},
};

export default settings;
