const tmi = require('tmi.js');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const yafney = new tmi.Client({
	options: { debug: false },
	identity: {
		username: 'yafney',
		password: process.env.yafney_twitch
	},
	channels: ['tssuukiii']
});

function secs(s){
	return s*1000;
}

function check_msg(str, what){
	const allowedSeparator = '\\\s,;"\'|';
	got = false;
	what.forEach(function(word){
		const regex = new RegExp(`(^.*[${allowedSeparator}]${word}$)|(^${word}[${allowedSeparator}].*)|(^${word}$)|(^.*[${allowedSeparator}]${word}[${allowedSeparator}].*$)`, 'i',);
		if(regex.test(str)){
			got = true;
			return;
		}
	});
	return got;
}

function say_stuff(channel, label, what, offset){
	if(Date.now() >= timeout[label] || typeof timeout[label] === 'undefined'){
		yafney.say(channel, what);
		timeout[label] = offset;
	}
}

yafney.connect();

timeout = [];

yafney.on('message', (channel, tags, message, self) => {
	if(self) return;
	console.log(tags);
	
	if(check_msg(message, ['@yafney'])){
		msg = ['What is it again? You have law problems? yanfeiBan BOP', "yanfeiHmm I'll remind you again: The law can be both a help and a hindrance", 'yanfeiSmug', 'yanfeiHmm'];
		say_stuff(channel, 'mention', msg[Math.floor(Math.random()*msg.length)], secs(10));
	}
	if(check_msg(message, ['yanfei', 'yafney', 'yafnei'])){
		say_stuff(channel, 'yafney', `If you're concerned about what kind of complicated issues you might get tied up in during your travels, your best bet is to bring someone with you who knows and understands the law. Someone like me, for example, whose expertise goes beyond just the law of Liyue... Well, actually, having said that, Fontaine's law is notoriously complicated... Though, with my level of intelligence, getting acquainted with it should be no problem! Anyway... My point is, you can always rely on me!`, secs(360));
	}
});