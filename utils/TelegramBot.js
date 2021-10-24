const fetch = require('node-fetch');
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

	async messageSubsOf(subTo) {
		this.subscriber[subTo].forEach(async (sub) => {
			await this.sendMessage(sub, 'test');
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
}
module.exports = TelegramBot;
