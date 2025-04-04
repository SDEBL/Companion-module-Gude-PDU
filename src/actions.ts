// import { Regex } from '@companion-module/base'
import type { GudePowerControlInstance } from './main.js'

export function UpdateActions(self: GudePowerControlInstance):void {
	self.setActionDefinitions({
		setSeatState:{
			name: "Set PowerState",
			options: [
			{
				id: 'port',
				type: 'number',
				label: 'port Number',
				default: 1,
				min: 1,
				max: 12,
			},
			{
				id: 'state',
				type: 'checkbox',
				label: 'State',
				default: true,
			}
		],
		callback: async ({options}) => {
			const port =  await self.parseVariablesInString(options.port as string)
			const state = await self.parseVariablesInString(options.state as string)
			console.log('Set Microphone State  ', port , " to ", state )
			self.setPortState(parseInt(port), JSON.parse(state))
		},
	}
	})
}
