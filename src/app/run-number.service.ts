import { Injectable, NgZone } from '@angular/core';
import { RunNumberStreamify } from '@cloudy-db/js';
import { ReplaySubject, Observable, ConnectableObservable, Subject } from 'rxjs';
import { filter, switchAll, multicast, map, tap, first, concat, bufferCount, take } from 'rxjs/operators';
import { zonify } from './helpers/monkey-patch-stream';
import { groupBy, sumBy, mapValues, get } from 'lodash';
import * as moment from 'moment';

export interface Bill {
	amount: number;
	currency: string;
	time: Date;
	name: string;
	comment?: string;
	id?: string;
}

function getInstance(runNumber$: Observable<any>): Promise<any> {
	return new Promise((resolve, reject) => {
		runNumber$
			.pipe(
				filter((val) => !!val),
				first(),
			)
			.subscribe(
				(val) => resolve(val),
				(e) => reject(e),
			);
	});
}

@Injectable()
export class RunNumberService {
	runNumberInternal$ = new ReplaySubject<any>(1);
	runNumber$: Observable<any>;
	activities$: Observable<any>;
	summary$: Observable<any>;
	dashboard$: Observable<any>;
	today$: Observable<any>;
	degraded$: Observable<boolean>;

	constructor(private ngZone: NgZone) {
		this.runNumber$ = this.runNumberInternal$.pipe(zonify(ngZone));

		this.runNumber$
			.pipe(bufferCount(2, 1))
			.subscribe(([old]) => {
				old.cloudy.stop().then(() => {
					console.log('stopped old OrbitDB instance', old);
				});
			});

		RunNumberStreamify.create({
			namespace: 'testing',
		}).then((runNumber) => {
			console.log('RunNumber instance', runNumber);
			this.runNumberInternal$.next(runNumber);
		});

		this.activities$ = this.runNumber$
			.pipe(
				map((rns) => rns.activities$),
				switchAll(),
				zonify(this.ngZone)
			);

		this.summary$ = this.activities$
			.pipe(
				map((activities) => {
					let byPerson = groupBy(activities, 'name');

					byPerson = mapValues(byPerson, (person) => {
						// @ts-ignore
						person = groupBy(person, 'currency');
						// @ts-ignore
						person = mapValues(person, (currency) => {
							// @ts-ignore
							currency = sumBy(currency, 'amount');
							return currency;
						});
						return person;
					});

					return byPerson;
				}),
				map((buddies) => Object.entries(buddies)),
				map((buddies) => buddies.map((buddy) => ({
					name: buddy[0],
					currencies: Object.entries(buddy[1]).map((currency) => ({
						name: currency[0],
						amount: currency[1],
					})),
				})))
			);

		this.dashboard$ = this.activities$
			.pipe(
				map((activities) => {
					const byCurrency = groupBy(activities, 'currency');

					return mapValues(byCurrency, (currency) => {
						// @ts-ignore
						currency = sumBy(currency, 'amount');
						return currency;
					});
				}),
				map((currencies) => Object.entries(currencies)),
				map((currencies) => currencies.map((currency) => ({
					name: currency[0],
					amount: currency[1],
				}))),
			);

		this.today$ = this.activities$
			.pipe(
				map((activities) => {
					const past24 = moment().subtract(24, 'hours').toDate();
					const now = new Date();
					return activities.filter((activity) => activity.time >= past24 && activity.time <= now);
				}),
				map((activities) => {
					const byCurrency = groupBy(activities, 'currency');

					return mapValues(byCurrency, (currency) => {
						// @ts-ignore
						currency = sumBy(currency, 'amount');
						return currency;
					});
				}),
				map((currencies) => Object.entries(currencies)),
				map((currencies) => currencies.map((currency) => ({
					name: currency[0],
					amount: currency[1],
				}))),
			);

		this.degraded$ = this
			.runNumber$
			.pipe(
				map((instance) => get(instance, 'cloudy.degraded', false))
			);
	}

	async addBill(bill: Bill): Promise<Bill> {
		return (await getInstance(this.runNumber$)).addBill(bill);
	}

	async get(key: string): Promise<Bill> {
		return (await getInstance(this.runNumber$)).get(key);
	}

	async del(key: string): Promise<Bill> {
		return (await getInstance(this.runNumber$)).del(key);
	}

	async switchTo(id: string) {
		const instance = await RunNumberStreamify.create({
			namespace: id,
		});
		this.runNumberInternal$.next(instance);
	}

	updateWakeupFunction(func: Function, deviceId: string) {
		return this.instanceOnce((instance) => instance.cloudy.updateWakeupFunction(func, deviceId));
	}

	instanceOnce(func) {
		return new Promise((resolve, reject) => {
			this.runNumber$
			.pipe(take(1))
			.subscribe((instance) => {
				resolve(func(instance));
			}, () => {
				reject(new Error('cannot get RunNumber instance'));
			});
		});
	}

}
