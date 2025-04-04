import { Regex, type GudePowerControlConfigField } from '@companion-module/base'

export interface GudePowerControlConfig {
	host: string
	port: number
	user: string
	password: string
}

export function GetConfigFields(): GudePowerControlConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Gude IP',
			width: 8,
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Target Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 9080,
		},
		{
			type: 'textinput',
			id: 'user',
			label: 'User Name',
			width: 25,
		},
		{
			type: 'textinput',
			id: 'password',
			label: 'Password',
			width: 25,
		},
	]
}
