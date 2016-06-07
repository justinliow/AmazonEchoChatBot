


var https	=require('https')
,AlexaSkill =require('./AlexaSkill')
,APP_ID= 'amzn1.echo-sdk-ams.app.6834a535-11c9-4c5b-ab09-965aaf99fba1';

var clientAccessToken='c22c6346a7f74815b8602506e9fd1933';
var url=function(query){
	var options={
	
		hostname: 'api.api.ai',
		path: '/v1/query?lang=EN&query='+encodeURI(query),
		method: 'GET',
		headers:{
			'Authorization': 'Bearer c22c6346a7f74815b8602506e9fd1933'
		}
	};
	return options;
};

var getJsonFromAllie=function(query, callback){
	https.get(url(query), function(res){
		
		var body='';
		res.on('data', function(data){
			body+=data;
		});

		res.on('end', function(){
			var result=JSON.parse(body);
			callback(result);
		});

	}).on('error', function(e){
		console.log('Error: ' +e);
	});
};

var handleNextQuery= function(intent, session, response){
	getJsonFromAllie(intent.slots.subject.value, function(data){
		if(data.result.speech){
			var text=data.result.speech;
			var cardText = text;
		}
		else{
			var text = 'I can\'t answer that';
			var cardtext=text;
		}
	var heading= text;
	response.tellWithCard(text, heading, cardText);
	});
};

var AllieQuery=function(){
	AlexaSkill.call(this, APP_ID);
};

//start
AllieQuery.prototype=Object.create(AlexaSkill.prototype);
AllieQuery.prototype.constructor=AllieQuery;
AllieQuery.prototype.eventHandlers.onLaunch=function(launchRequest, session, response){
	var output= "I'm Allie, How could I help you";
	var reprompt= "How can I help you?";
	response.ask(output, reprompt);	
};

AllieQuery.prototype.intentHandlers={
	GetQueryIntent: function(intent, session, response){
		handleNextQuery(intent, session, response);
	},
	HelpIntent: function(intent, session, response){
	var speech='how can I help you';
	response.ask(speech);

	}
};


exports.handler =function(event, context){
	var skill= new AllieQuery();
	skill.execute(event, context);
};

