import { registerWhen } from '../../../BloomCore/utils/Utils';

export default class alerts {
    /**
     * @param {import('../../../index.js').default} main
     */
    constructor(main) {
        this.main = main;
        this.cellcount = 0;
        this.wandcount = 0;
        this.icecount = 0;
        this.icespraycd = false;
        this.katanaAlert = false;
        const _this = this;
        this.gyroWand = [
            register('ActionBar', () => {
                _this.cellalert();
            }).setCriteria(/.+\(Cells Alignment\).+/).unregister(),
            register('Chat', () => {
                _this.cellalert();
            }).setCriteria(/([A-Za-z0-9_]+) casted Cells Alignment on you!/).unregister()
        ];
        this.registerAlert("gyroWand", 
            () => 
                _this.main.settings.values.cells_alignment_alerts
        );
        this.healingWand = [
            register('ActionBar', () => {
                    wandcount++;
                    let localwandcount = wandcount;
                    setTimeout(() => {
                        if (this.wandcount === localwandcount)
                            Client.showTitle("&cYour Healing Wand has expired!", "", 0, 40, 10)
                    }, 5800);
            }).setCriteria(/.+\((Small|Medium|Big|Huge) Heal\).+/).unregister(),
        ]
        this.registerAlert("healingWand",
            () =>
                _this.main.settings.values.healing_wand_alerts
        );
        this.iceSpray = [
            register('ActionBar', () => {
                if (this.icespraycd == false)
                    if (settings.ice_spray_alerts == true) {
                        this.icecount++;
                        let localicecount = this.icecount;
                        let allow = false
                        function icespray(num) {
                            if (this.icecount == localicecount) {
                                if (num >= 4) {
                                    Client.showTitle("&aIce Spray expiring in "+ num +" Seconds!", "", 0, 22, 0)
                                    allow = true
                                } else if (num >= 2) {
                                    Client.showTitle("&eIce Spray expiring in "+ num +" Seconds!", "", 0, 22, 0)
                                    allow = true
                                } else if (num == 1) {
                                    Client.showTitle("&cIce Spray expiring in "+ num +" Second!", "", 0, 22, 0)
                                    allow = true
                                } else if (num == 0) {
                                    Client.showTitle("&cIce Spray expired!", "", 0, 22, 0)
                                    allow = false
                                }
                            }
                            let newnum = num-1;
                            setTimeout(() => {
                                if (allow) icespray(newnum)
                            }, 1000);
                        }
                        icespray(5);
                        this.icespraycd = true;
                        setTimeout(() => {
                            this.icespraycd = false
                        }, 3000);
                    }
            }).setCriteria(/.+\(Ice Spray\).+/).unregister()
        ]
        this.registerAlert("iceSpray",
            () =>
                _this.main.settings.values.ice_spray_alerts
        );

        this.katana = [
            register('ActionBar', () => {
                if (this.katanaAlert == false) {
                    this.katanaAlert = true;
                    setTimeout(() => {
                        this.katanaAlert = false;
                    }, 3000);
                    Client.showTitle("&cKatana has expired!", "", 0, 40, 10)
                }
            }).setCriteria(/.+\(Katana\).+/).unregister()
        ]
        this.registerAlert("katana",
            () =>
                _this.main.settings.values.katana_alerts
        );

        this.weirdTuba = [
            register('ActionBar', () => {
                if (this.howlactive == false) {
                    this.howlactive = true;
                    let item = Player.getHeldItem().getName();
                    if (/.+Weirder.+Tuba/.test(item) == true) {
                        setTimeout(() => {
                            this.howlactive = false;
                            Client.showTitle("&cYour Weirder Tuba has expired!", "", 0, 40, 10)
                        }, 30000);
                    } else {
                        setTimeout(() => {
                            this.howlactive = false;
                            Client.showTitle("&cYour Weird Tuba has expired!", "", 0, 40, 10)
                        }, 20000);
                    }
                }
            }).setCriteria(/.+\(Howl\).+/).unregister()
        ];

        this.registerAlert("weirdTuba",
            () =>
                _this.main.settings.values.weird_tuba_alerts
        );

        this.witherCloak = [
            register('chat', () => {
                    Client.showTitle("&cYour Wither Cloak Disabled!", "", 0, 40, 10)
            }).setCriteria(/(Creeper Veil De-activated! \(Expired\)|Not enough mana! Creeper Veil De-activated!)/).unregister()
        ]

        this.registerAlert("witherCloak",
            () =>
                _this.main.settings.values.wither_cloak_alerts
        );

        register('chat', () => {
            this.main.socket.send({
                "type": "lowSoulflow",
                "payload": {
                    "amount": this.main.settings.values.low_soulflow_amount
                }
            });
        }).setCriteria(/^Sending\sto\sserver\s.+$/)

        this.main.helpers.setInterval(() => {
            this.main.socket.send({
                type: "lowSoulflow",
                payload: {
                    amount: this.main.settings.values.low_soulflow_amount
                }
            });
        }, 120000);

    }

    cellalert() {
        this.cellcount++;
        let localcellcount = this.cellcount;
        setTimeout(() => {
            if (this.cellcount == localcellcount)
                Client.showTitle("&eCells Alignment Expires Soon!", "", 0, 40, 0)
            setTimeout(() => {
                if (this.cellcount == localcellcount)
                    Client.showTitle("&cCells Alignment Has Expired!", "", 0, 40, 10)
            }, 2400);
        }, 3000);
    }

    registerAlert(name, criteria) {
        for (let reg of this[name])
            registerWhen(reg, criteria);
    }

}