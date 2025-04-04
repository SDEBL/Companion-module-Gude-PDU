import { combineRgb } from '@companion-module/base'
import type { GudePowerControlInstance } from './main.js'
//import { resolve } from 'path'

export function UpdateFeedbacks(self: GudePowerControlInstance): void {
	self.setFeedbackDefinitions({
		micState: {
			name: 'Microphone State',
			type: 'boolean',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'port',
					type: 'number',
					label: 'Port',
					default: 1,
					min: 0,
					max: 12,
				},
			],
			callback: (feedback) => {
				let status = self.getPortState(parseInt(feedback.options.port as string))?.then (data => {
					console.log('port status:', feedback.options.port , " -  ", data)
					return (data? data: false)
					})
				return Promise.resolve(status) 
			},
			subscribe: (feedback) => {
                self.pollSubscribe(parseInt(feedback.options.port as string))
            },
            unsubscribe: (feedback) => {
                self.Pollunsubscribe(parseInt(feedback.options.port as string) )
            },
		},
	})
}
