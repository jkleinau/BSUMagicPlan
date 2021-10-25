const fetch = require('node-fetch');
const Subscriber = require('../models/subscriber');

class TelegramBot {
	constructor(API_KEY, subscriber) {
		this.API_KEY = API_KEY;

		this.subscriber = subscriber;
	}

	async sendMessage(recipient, message) {
		await fetch(`https://api.telegram.org/bot${this.API_KEY}/sendMessage`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				text: message,
				chat_id: recipient,
			}),
		});
	}

	async messageSubsOf(subTo, message) {
		this.subscriber[subTo].forEach(async (sub) => {
			await this.sendMessage(sub, message);
		});
	}

	async recieveMessages() {
		const response = await fetch(`https://api.telegram.org/bot${this.API_KEY}/getUpdates`, {
			method: 'GET',
		});
		const data = await response.json();
		return data;
	}

	async getAllChatIDs() {
		const messages = await this.recieveMessages();
		const chats = messages['result'].map((chat) => {
			return chat['message']['chat']['id'];
		});
		const uniqueChats = new Set(chats);
		return uniqueChats;
	}

	async checkForNewUsers() {
		const messages = await this.recieveMessages();
		const chats = messages['result'].map((message) => {
			return message['message']['chat'];
		});
		const newChats = chats.map(async (chat) => {
			await Subscriber.countDocuments({ chat_id: chat.id }, async (err, count) => {
				if (err) {
					console.error(err);
				}
				if (count == 0) {
					await new Subscriber({ chat_id: chat.id, first_name: chat.first_name, last_name: chat.last_name }).save();
				}
			});
		});
	}
}
module.exports = TelegramBot;
