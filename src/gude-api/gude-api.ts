import fetch, { HeadersInit, Response } from 'node-fetch'

class HTTPResponseError extends Error {
	response: any
	constructor(response: Response) {
		super(`HTTP Error Response: ${response.status} ${response.statusText}`)
		this.response = response
	}
}

export interface GudePortStatusResponse{
    outputs: GudePortInfo[]
}

export interface GudePortInfo{
	name: string,
	state: number,
	sw_cnt: number,
	type: number,
	batch: number[],
	wdog: number[]
}

export default class GudeApi {
	private _host: string
	private _user: string
	private _password: string
    private _defaultHeaders: HeadersInit

	constructor(host: string, user: string, password: string) {
		this._host = host
		this._user = user
		this._password = password
		this._defaultHeaders = {
			Accept: 'application/json'
		}
	}

	private checkStatus(response: Response) {
		if (response.ok) {
			// response.status >= 200 && response.status < 300
			return response
		} else {
			throw new HTTPResponseError(response)
		}
	}
	public async GetPort(portNbr: number): Promise<boolean> {
		if(this._user != null || this._password !=null){

		}
		const url = `http://${this._host}/statusjsn.js?components=1`
		console.log('GetPort' , url , " - ",portNbr)
		const response = await fetch(url, {
			method: 'get',
			headers: this._defaultHeaders,
		 })
		this.checkStatus(response)	
		const data = (await response.json()) as GudePortStatusResponse
		console.log('GetPort' , JSON.stringify(data))
		console.log('State ', portNbr-1, " - " , data.outputs[portNbr-1].state)
		return (data.outputs[portNbr-1].state == 1) 
	}
	
	public async SetPort(portNbr: number, state: boolean){ 
		const url = `http://${this._host}/statusjsn.js?components=1&cmd=1&p=${portNbr}&s=${state?1:0}}  `
		console.log('SetPort' , url )
		const response = await fetch(url, {
			method: 'get',
			headers: this._defaultHeaders,
		})
		this.checkStatus(response)	
//		console.log('SetPort response - ' , response.json())
		const data = (await response.json()) as GudePortStatusResponse	
		console.log('SetPort response - ',  JSON.stringify(data.outputs[portNbr-1]))
		return data.outputs[portNbr-1].state
	}
	
}
