import {Meteor} from 'meteor/meteor';
import {Campaigns, Cards, Session, Layouts} from './collections';
import method from './utils/method';
import collectionMethods from './utils/collection-methods';
import {Accounts} from 'meteor/accounts-base';

export const Campaign = collectionMethods(Campaigns);
export const Card = collectionMethods(Cards);
export const Layout = collectionMethods(Layouts);

export const addRelated = method('addRelated', function(card, related) {
	Cards.update(card._id, {
		$addToSet: {related: related._id},
	});
});

export const removeRelated = method('removeRelated', function(card, related) {
	Cards.update(card._id, {
		$pull: {related: related._id},
	});
});

export const deleteCardWithRelated = method('deleteCardWithRelated', function(card, {ofType: type}) {
	Cards.remove({
		$or: [
			{_id: card._id},
			{
				type,
				_id: {$in: card.related || []}
			}
		]
	});
});

export const setSession = method('setSession', function(campaignId, _key, data) {
	const existing = Session.findOne({
		campaignId,
		_key
	});

	if(campaignId) {
		if(existing) {
			Session.update(existing._id, {$set: {data}});
		} else {
			Session.insert({data, campaignId, _key});
		}
	} else {
		console.trace('No campaign id');
	}
});

export const createAccount = method('createAccount', function(user, campaign) {
	if(!this.isSimulation) { // this only works on the server
		const userId = Accounts.createUser(user);
		Campaign.create(Object.assign({
			owner: userId,
		}, campaign));

		Accounts.sendEnrollmentEmail(userId, user.email);
	}
});
