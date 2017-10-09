import {Meteor} from 'meteor/meteor';
import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import _ from 'lodash';
import Markdown from 'react-markdown';
import SyncedSession from 'meteor/quarterto:synced-session';

import {Cards} from '../../shared/collections';
import preventingDefault from '../preventing-default';

import Toggler from './toggler';
import {
	Card as CardPrimitive,
	Label,
	List,
	Input,
	Textarea,
	FormGroup,
	Button,
	Icon,
	LabelBody,
} from './primitives';
import {Field, Form, Select} from './form';
import CardSelect from './card-select';
import LabelInput from './label-input';

export const EditCard = ({card, saveCard, toggle, deleteCard}) =>
	<Form
		onSubmit={saveCard}
		onDidSubmit={toggle}
		initialData={card}
	>
		<FormGroup>
			<Field name="title" placeholder="Title" tag={Input} fullWidth />
			<Field name="type" placeholder="type" tag={Input} fullWidth />
		</FormGroup>

		<FormGroup>
			<Field name="text" tag={Textarea} fullWidth />
		</FormGroup>

		<List>
			<Button colour={card._id ? 'sky' : 'apple'}>
				<LabelBody>
					{card._id ? <Icon icon="ion-checkmark" /> : <Icon icon="ion-plus" />}
					{card._id ? 'Save' : 'Add'} card
				</LabelBody>
			</Button>
			{toggle &&
				<Button onClick={preventingDefault(toggle)} colour="steel">
					<LabelBody>
						<Icon icon="ion-close" /> Cancel
					</LabelBody>
				</Button>}
			{deleteCard &&
				<Button
					onClick={preventingDefault(() => deleteCard(card))}
					colour="scarlet"
				>
					<LabelBody>
						<Icon icon="ion-trash-a" /> Delete
					</LabelBody>
				</Button>}
		</List>
	</Form>;

const EditCardContainer = createContainer(
	() => ({
		saveCard(card) {
			if (card._id) {
				Cards.update(card._id, {$set: _.omit(card, '_id')});
			} else {
				Cards.insert(card);
			}
		},

		deleteCard(card) {
			Cards.remove(card._id);
		},
	}),
	EditCard
);

const ShowCard = ({
	card,
	toggle,
	relatedCards,
	removeRelated,
	addRelated,
	selectCard,
}) =>
	<div>
		{card.type && <Label colour='sky'>
			<LabelBody>
				{card.type}
			</LabelBody>
		</Label>}

		<List>
			{toggle && <Button onClick={toggle}>
				<LabelBody>
					<Icon icon='ion-edit' />
				</LabelBody>
			</Button>}
		</List>

		<article>
			<h1>
				<a onClick={preventingDefault(selectCard)} href='#'>
					{card.title}
				</a>
			</h1>

			<Markdown source={card.text || ''} />
		</article>

		<List>
			{relatedCards.map(related =>
				<Label onClick={() => removeRelated(related)} colour='aqua' key={related._id}>
					<LabelBody>
						{related.title}
					</LabelBody>
				</Label>
			)}
			<div>
				<CardSelect
					onSelect={addRelated}
					skip={[card._id].concat(card.related || [])}
				/>
			</div>
		</List>
	</div>;

const ShowCardContainer = createContainer(({card}) => ({
	relatedCards: Cards.find({_id: {$in: card.related || []}}).fetch(),
	addRelated(related) {
		Cards.update(card._id, {
			$addToSet: {related: related._id},
		});
	},
	removeRelated(related) {
		Cards.update(card._id, {
			$pull: {related: related._id},
		});
	},
	selectCard() {
		SyncedSession.set('selectedCard', card._id);
	},
}), ShowCard);

const Card = props =>
	<CardPrimitive large={props.large}>
		<Toggler
			active={EditCardContainer}
			inactive={ShowCardContainer}
			{...props}
		/>
	</CardPrimitive>;

export default Card;
