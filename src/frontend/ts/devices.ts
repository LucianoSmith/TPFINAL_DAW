class Device{
    public id: number;
    public name: string;
    public description: string;
    public type: number;
    public state: number;
    public posx: number;
    public posy: number;

    constructor(id: number, name: string, desc: string, type: number, stat: number, posx: number, posy: number) {
        this.id = id;
        this.name = name;
        this.description = desc;
        this.type = type;
        this.state = stat;
        this.posx = posx;
        this.posy = posy;
    }

    listDevices():void {
        console.log("id = " + this.id + " Nombre = " + this.name);
    }

    getDeviceInfo(id: number) {

    }

    updateDevice(id: number) {

    }

    deleteDevice(id: number) {

    }
}