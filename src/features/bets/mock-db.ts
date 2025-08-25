// Dummy bets DB with localStorage and event broadcasting

export interface DummyBet {
	id: string;
	wallet: string;
	marketId: string;
	marketTitle: string;
	outcomeId: string;
	outcomeLabel: string;
	stake: number;
	odds: number;
	status: 'active' | 'won' | 'lost' | 'cancelled' | 'pending' | 'confirmed' | 'failed';
	placedAt: string;
}

const LS_BETS = 'mockdb.bets';
const BETS_EVENT = 'mock-bets-change';

function readBets(): DummyBet[] {
	try {
		const raw = localStorage.getItem(LS_BETS);
		if (!raw) return [];
		return JSON.parse(raw) as DummyBet[];
	} catch {
		return [];
	}
}

function writeBets(bets: DummyBet[]) {
	localStorage.setItem(LS_BETS, JSON.stringify(bets));
}

function emitBetsChange() {
	window.dispatchEvent(new CustomEvent(BETS_EVENT));
}

export function onBetsChange(callback: () => void) {
	const handler = () => callback();
	window.addEventListener(BETS_EVENT, handler);
	return () => window.removeEventListener(BETS_EVENT, handler);
}

export function getAllBets(): DummyBet[] {
	return readBets();
}

export function addBet(bet: Omit<DummyBet, 'id' | 'placedAt' | 'status'> & Partial<Pick<DummyBet, 'status'>>) {
	const bets = readBets();
	const newBet: DummyBet = {
		id: `bet_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
		placedAt: new Date().toISOString(),
		status: bet.status ?? 'pending',
		...bet,
	};
	writeBets([newBet, ...bets]);
	emitBetsChange();
	return newBet;
}

export function updateBet(id: string, patch: Partial<DummyBet>) {
	const bets = readBets();
	const idx = bets.findIndex(b => b.id === id);
	if (idx >= 0) {
		bets[idx] = { ...bets[idx], ...patch };
		writeBets(bets);
		emitBetsChange();
		return bets[idx];
	}
	return null;
}

// Simulator: periodically confirm pending bets and randomly settle some active ones
let simulatorStarted = false;
export function startBetsSimulator() {
	if (simulatorStarted) return;
	simulatorStarted = true;
	setInterval(() => {
		const bets = readBets();
		let changed = false;
		for (const b of bets) {
			if (b.status === 'pending') {
				b.status = 'confirmed';
				changed = true;
				continue;
			}
			if (b.status === 'confirmed' && Math.random() < 0.2) {
				b.status = 'active';
				changed = true;
				continue;
			}
			if (b.status === 'active' && Math.random() < 0.1) {
				b.status = Math.random() < 0.5 ? 'won' : 'lost';
				changed = true;
			}
		}
		if (changed) {
			writeBets(bets);
			emitBetsChange();
		}
	}, 8000);
}
