import GudeApi from './gude-api/gude-api.js'
import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type GudePowerControlConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'

export class GudePowerControlInstance extends InstanceBase<GudePowerControlConfig> {
	config!: GudePowerControlConfig // Setup in init()
	private _api: GudeApi | null = null

	private _subscriptions= new Array()


	public Pollunsubscribe(value: number) {
		const index = this._subscriptions.indexOf(value, 0);
		if (index > -1) {
			console.log('unsubscribe' , value)
			this._subscriptions.splice(index, 1);
		}
		this.shouldBePolling = this._subscriptions.length > 0 
		if (this.shouldBePolling && !this.isPolling) {
			this.pollInUseStatus()
			// it stops by itself
		}
	}

	public pollSubscribe(value: number) {
		const index = this._subscriptions.indexOf(value, 0);
		if (index == -1) {
			console.log('subscribe' , value)
			this._subscriptions.push(value)
		}
		this.shouldBePolling =  this._subscriptions.length > 0 
		if (this.shouldBePolling && !this.isPolling) {
			this.pollInUseStatus()
			// it stops by itself
		}
	}

	private shouldBePolling: boolean = false
	private isPolling: boolean = false

	sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: GudePowerControlConfig): Promise<void> {
		this.config = config
		this._api = new GudeApi(config.host, config.user, config.password)
		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.subscribeFeedbacks()
	}

	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
		this._api = null
		this.shouldBePolling = false
	}

	private async pollInUseStatus() {
		this.isPolling = true
		try {
			// loop until we don't need to poll any more
			while (this._api && this.shouldBePolling) {
				// check the status via the api
				try {
					this.updateStatus(InstanceStatus.Ok)
  					this.checkFeedbacks('portState')
				} catch (e: any) {
					this.updateStatus(InstanceStatus.ConnectionFailure, e.message)
				}
				await this.sleep(750)
			}
		} finally {
			this.isPolling = false
		}
	}
	async configUpdated(config: GudePowerControlConfig): Promise<void> {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	async getPortState(port: number){
		return await this._api?.GetPort(port) 
	}

	setPortState(port: number, state: boolean) {
		this._api?.SetPort(port, state)
	}
}

runEntrypoint(GudePowerControlInstance, UpgradeScripts)
