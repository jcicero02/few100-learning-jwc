import { isEven } from "./utils";
import { tassign } from "tassign";

describe('function', () => {
    describe('parameters etc.', () => {

        it('you cannot overload functions in functions', () => {

            function formatName(first: string, last: string, mi?: string): string {
                let fullName = `${last}, ${first}`;

                return mi ? fullName += ` ${mi}.` : fullName;
            }

            expect(formatName('Han', 'Solo')).toBe('Solo, Han');
            expect(formatName('Han', 'Solo', 'D')).toBe('Solo, Han D.');

        });
        it('default valus for parameters', () => {
            function add(a: number = 5, b: number = 10): number {
                return a + b;
            }

            expect(add(2, 2)).toBe(4);
            expect(add(2)).toBe(12);
            expect(add()).toBe(15);
            expect(add(undefined, 5)).toBe(10);
        });
        it('takes an arbitrary number of parameters', () => {
            function add(a: number, b: number, ...rest: number[]): number {
                const firstTwo = a + b;
                return rest.reduce((x, y) => x + y, firstTwo);

            }

            expect(add(2, 2)).toBe(4);
            expect(add(1, 2, 3, 4, 5, 6, 7, 8, 9)).toBe(45);
        });
        it('duck typing', () => {
            interface MessageHaver { message: string }
            function doIt(thing: MessageHaver) {
                console.log(thing.message);
            }

            // doIt("hi");
            const phoneCall = {
                message: 'Call me',
                from: 'Your Mom',
                when: '8:00 a.m.'
            }
            doIt(phoneCall);

            class PhoneCall {

                returned: boolean;

                constructor(public message: string, public from: string, private time: String) { }

                return() {
                    this.returned = true;
                }
            }

            const call2 = new PhoneCall('Your car is ready', 'Car Shop', '8:00 AM');
            call2.return();

            expect(call2.from).toBe('Car Shop');

            doIt(call2);
        });

        it('discriminated unions', () => {
            interface Action {
                type: string;
            }
            class NumberIncremented implements Action {
                readonly type = 'Increment'
                constructor(public incrementedBy: number) { }
            }

            class NumberDecremented {
                readonly type = 'Decrement'
                constructor(public decrementedBy: number) { }
            }

            class NumberReset {
                readonly type = 'Reset'
                constructor() { }
            }

            type Actions = NumberIncremented | NumberDecremented | NumberReset;
            const actions: Actions[] = [
                new NumberIncremented(3),
                new NumberIncremented(2),
                new NumberDecremented(1),
                new NumberReset(),
                new NumberIncremented(3),
                new NumberIncremented(2)
            ];

            /*
            let num = 0;
            actions.forEach(a => {
                switch (a.type) {
                    case 'Increment': {
                        num += a.incrementedBy;
                        return;
                    }
                    case 'Decrement': {
                        num -= a.decrementedBy;
                    }
                    case 'Reset': {
                        num = 0;
                    }
                }
            })
            */

            let intialState = 0;
            const num = actions.reduce((s, n) => {
                switch (n.type) {
                    case 'Increment': {
                        return s += n.incrementedBy;
                    }
                    case 'Decrement': {
                        return s += n.decrementedBy;
                    }
                    case 'Reset': {
                        return 0;
                    }
                }
            }, intialState)

            expect(num).toBe(5);
        });
    });
    describe('array methods as higher ordered functions', () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        it('forEach allows you to visit each member of an array', () => {
            numbers.forEach(e => console.log(e));

        });
        describe('methods that produce a new array', () => {
            it('selecting specific elements of an array', () => {
                const evens = numbers.filter(isEven);

                expect(evens).toEqual([2, 4, 6, 8]);
                expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
            it('transforming an array from one thing to another', () => {
                const doubles = numbers.map(n => n * 2);
                expect(doubles).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18]);

                const toStrings = numbers.map(n => n.toString());
                expect(toStrings).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
            });
            it('a practice', () => {

                // Just the doubled odd numbers
                const odds = numbers
                    .filter(x => !isEven(x))
                    .map(y => y * 2);

                expect(odds).toEqual([2, 6, 10, 14, 18]);

            });

            it('another practice', () => {
                interface Vehicle {
                    vin: string;
                    makeAndModel: string;
                    mileage: number;
                }
                const vehicles: Vehicle[] = [
                    { vin: '9999', makeAndModel: 'Chevy Tahoe', mileage: 182000 },
                    { vin: 'aka92', makeAndModel: 'Toyota Prius', mileage: 89999 },
                    { vin: 'kduwi', makeAndModel: 'Ford Explorer', mileage: 99998 }
                ];

                // a low mileage vehicle is any vehicle with < 100_000 miles on it.
                const lowMileageVehicles = vehicles
                    .filter(x => x.mileage < 100000)
                    .map(y => y.makeAndModel);

                expect(lowMileageVehicles).toEqual(['Toyota Prius', 'Ford Explorer']);
            });

        });
        describe('that return a single (scalar) value', () => {
            describe('checking the membership of an array', () => {
                it('does every membership meet a requirment', () => {
                    expect(numbers.every(isEven)).toBe(false);
                });
                it('does any member of the array meet the requirment', () => {
                    expect(numbers.some(isEven)).toBe(true);
                });
            });
            describe('BOIL DOWN AN ARRAY OF THINGS TO JUST ONE THING', () => {
                it('reducing an array of numbers - easy mode', () => {
                    const total = numbers.reduce((s, n) => s + n);
                    expect(total).toBe(45);

                    const total2 = numbers.reduce((s, n) => s + n, 100);
                    expect(total2).toBe(145);
                });
                it('a bigger example', () => {
                    interface Vehicle {
                        vin: string;
                        makeAndModel: string;
                        mileage: number;
                    }
                    const vehicles: Vehicle[] = [
                        { vin: '9999', makeAndModel: 'Chevy Tahoe', mileage: 182000 },
                        { vin: 'aka92', makeAndModel: 'Toyota Prius', mileage: 89999 },
                        { vin: 'kduwi', makeAndModel: 'Ford Explorer', mileage: 99998 }
                    ];


                    interface Result {
                        highMileageMakeAndModel: string;
                        highMileageMileage: number;
                        lowMileageMakeAndModel: string;
                        lowMileageMileage: number;
                    }


                    const seed: Result = {
                        highMileageMakeAndModel: null,
                        highMileageMileage: -1,
                        lowMileageMakeAndModel: null,
                        lowMileageMileage: 3_000_000
                    };

                    const answer = vehicles.reduce((s, n) => {

                        let result: Result = tassign(s);
                        if (n.mileage < s.lowMileageMileage) {
                            result.lowMileageMakeAndModel = n.makeAndModel;
                            result.lowMileageMileage = n.mileage;
                        }
                        if (n.mileage > s.highMileageMileage) {
                            result.highMileageMakeAndModel = n.makeAndModel;
                            result.highMileageMileage = n.mileage;
                        }
                        return result;
                    }, seed)

                    const expectedResult: Result = {
                        highMileageMakeAndModel: 'Chevy Tahoe',
                        highMileageMileage: 182_000,
                        lowMileageMakeAndModel: 'Toyota Prius',
                        lowMileageMileage: 89_999
                    }

                    expect(answer).toEqual(expectedResult);

                });

            });
        });
    });
});


// local storage and session sorage

//local on hardrrive
//session storage 