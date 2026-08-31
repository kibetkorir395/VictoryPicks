import { IoLogoFacebook, IoLogoInstagram, IoLogoWhatsapp } from "react-icons/io5";
import { FaTelegram } from "react-icons/fa"; 
import { PiXLogo } from "react-icons/pi";

export const pricings = [
	{
	  id: "1",
	  plan: "Daily",
	  billing: "Day",
	  title: "Complete access to 24-hour picks",
	  price: 250,
	  features: [
		"Instant access to premium daily tips.",
		"Professional Soccer Analyses",
		"High-accuracy daily football selections!",
	  ],
	  color: "#059212",
	},
	{
	  id: "2",
	  plan: "Weekly",
	  billing: "Week",
	  title: "Premium weekly passes for top insights",
	  price: 850,
	  features: [
		"Daily 10+ odds plus correct score picks",
		"Unlock 7 full days of premium predictions",
		"Stay ahead with expert weekly analysis",
	  ],
	  color: "#00A36C",
	},
	{
	  id: "3",
	  plan: "Monthly",
	  billing: "Month",
	  title: "All-inclusive tips for serious punters",
	  price: 2500,
	  features: [
		"Maximize returns with full monthly access.",
		"Get unrestricted VIP status for 30 days",
		"Launch your month-long profit streak today!",
	  ],
	  color: "#0A6847",
	},
];
  

export const faqs = [
	{
		id: 1,
		question: "How reliable are your football tips?",
		answer:
			"Our selections leverage deep historical stats, professional insight, and specialized algorithms. While no sports outcome can be completely guaranteed, our goal is to deliver highly reliable, statistics-backed data to help you place smarter bets.",
	},
	{
		id: 2,
		question: "What is the process for unlocking a plan?",
		answer:
			"Subscribing is simple right here on our platform. We feature multiple membership tiers designed for everyone from casual fans to serious punters. Just select your preferred package and complete your purchase using our secure checkout options.",
	},
	{
		id: 3,
		question: "Am I able to cancel or modify my membership?",
		answer:
			"No, all subscription sales are final and cannot be terminated early. Please review your selected plan carefully before completing the transaction to ensure it matches your requirements.",
	},
	{
		id: 4,
		question: "Which football competitions and leagues do you cover?",
		answer:
			"We track all elite global leagues, major international tournaments, and high-stakes fixtures. This covers everything from the English Premier League, La Liga, and Serie A to the Champions League and the World Cup.",
	},
	{
		id: 6,
		question: "What goes into generating your match tips?",
		answer:
			"We analyze a massive range of metrics including squad form, individual player output, head-to-head records, and current momentum. Our system also utilizes predictive models that adapt over time to enhance overall accuracy.",
	},
	{
		id: 7,
		question: "Should I rely on these forecasts for gambling?",
		answer:
			"Our forecasts are built on thorough analysis and solid data, but sports betting always carries financial risk. Please gamble responsibly, as we are not liable for any betting losses incurred.",
	},
	{
		id: 8,
		question: "Are real-time updates available during live games?",
		answer:
			"Yes, we provide live match-day alerts for major fixtures. These include valuable real-time data like live performance tracking, sudden injuries, and mid-game tactical shifts that could swing the final result.",
	},
	{
		id: 9,
		question: "Which tier is the right choice for me?",
		answer:
			"That comes down to your personal strategy. The basic tier handles standard daily selections, whereas our higher-level plans unlock deep analytical reports, advanced metrics, and elite tips. Compare our options to find your perfect fit.",
	},
	{
		id: 10,
		question: "Is my billing details and payment safe here?",
		answer:
			"Absolutely. Security is our top priority. Every transaction goes through fully encrypted, industry-standard payment gateways, and your private financial details are never saved or stored on our infrastructure.",
	},
];


export const featured = [
	{
		emoji: "🤝",
		title: "100% Guaranteed",
	},
	{
		emoji: "✅",
		title: "Secure Payments",
	},
	{
		emoji: "🏆",
		title: "Expert Analysis",
	},
	{
		emoji: "🚀",
		title: "Live Updates",
	},
];

export const socialUrls = [
	{ id: 1,icon: <IoLogoFacebook />,url: "https://www.facebook.com/share/1ZctTrAGNR/",title: "Facebook"},
	{ id: 2, icon: <FaTelegram />, url: "https://t.me/victorypicks_ke", title: "Telegram" },
    { id: 3, icon: <IoLogoWhatsapp />, url: "https://whatsapp.com/channel/0029VbAzC5EA89Mi4nOZRu0n", title: "WhatsApp" },
    { id: 4, icon: <PiXLogo />, url: "https://x.com/victorypicks_ke", title: "X(Twitter)" },
    { id: 5, icon: <IoLogoInstagram />, url: "https://instagram.com/victorypicks_ke", title: "Instagram" },
];

export const testimonials = [
	{
	  id: 1,
	  name: "James Kariuki",
	  title: "Daily Plan",
	  description: "These tips completely changed how I look at daily games. Perfect for casual punters!"
	},
	{
	  id: 2,
	  name: "Jonny_john",
	  title: "Monthly Plan",
	  description: "The deep analytics and expert breakdowns are total game-changers. The Monthly tier is an absolute must!"
	},
	{
	  id: 3,
	  name: "Alicia Chepkoech",
	  title: "Weekly Plan",
	  description: "For anyone serious about football forecasting, this package provides completely unmatched precision!"
	},
	{
	  id: 4,
	  name: "Johnson Nekesa",
	  title: "Daily Plan",
	  description: "The live match updates and historical stats are incredible. It makes staying ahead of the game so easy!"
	},
	{
	  id: 5,
	  name: "sarah-nduku",
	  title: "Monthly Plan",
	  description: "Value for money at its best! The selections are highly consistent and the data quality is top-tier."
	}
];
  
