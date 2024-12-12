function readJoysticks () {
    LeftX = pins.analogReadPin(AnalogReadWritePin.P0) - ofset
    LeftY = pins.analogReadPin(AnalogReadWritePin.P1) - ofset
    RightX = pins.analogReadPin(AnalogReadWritePin.P3) - ofset
    RightY = pins.analogReadPin(AnalogReadWritePin.P2) - ofset
}
let timeOut = 0
let RightY = 0
let RightX = 0
let LeftY = 0
let LeftX = 0
let ofset = 0
// we use P3 which is used for LED Array
led.enable(false)
pins.digitalWritePin(DigitalPin.P12, 1)
ofset = 500
let deadBand = 100
let BaseMin = 0
let BaseMax = 180
let BaseValue = 90
let LeftMin = 10
let LeftMax = 160
let LeftValue = 60
let RightMin = 60
let RightMax = 180
let RightValue = 90
let GripMin = 90
let GripMax = 180
let GripValue = 130
let FastStep = 5
pins.servoWritePin(AnalogPin.P13, BaseValue)
pins.servoWritePin(AnalogPin.P14, LeftValue)
pins.servoWritePin(AnalogPin.P15, RightValue)
pins.servoWritePin(AnalogPin.P16, GripValue)
basic.forever(function () {
    readJoysticks()
    if (Math.abs(LeftX) >= deadBand) {
        timeOut = 0
        FastStep = Math.map(LeftX, -500, 500, 5, -5)
        if (BaseValue >= BaseMin - FastStep && BaseValue <= BaseMax - FastStep) {
            BaseValue += FastStep
            pins.servoWritePin(AnalogPin.P13, BaseValue)
            pins.servoWritePin(AnalogPin.P14, LeftValue)
            pins.servoWritePin(AnalogPin.P15, RightValue)
            pins.servoWritePin(AnalogPin.P16, GripValue)
        }
    }
    if (Math.abs(LeftY) >= deadBand) {
        timeOut = 0
        FastStep = Math.map(LeftY, -500, 500, -5, 5)
        if (LeftValue >= LeftMin - FastStep && LeftValue <= LeftMax - FastStep) {
            LeftValue += FastStep
            pins.servoWritePin(AnalogPin.P14, LeftValue)
            pins.servoWritePin(AnalogPin.P16, GripValue)
        }
    }
    if (Math.abs(RightY) >= deadBand) {
        timeOut = 0
        FastStep = Math.map(RightY, -500, 500, -5, 5)
        if (RightValue >= RightMin - FastStep && RightValue <= RightMax - FastStep) {
            RightValue += FastStep
            pins.servoWritePin(AnalogPin.P15, RightValue)
            pins.servoWritePin(AnalogPin.P16, GripValue)
        }
    }
    if (Math.abs(RightX) >= deadBand) {
        timeOut = 0
        FastStep = Math.map(RightX, -500, 500, 5, -5)
        if (GripValue >= GripMin - FastStep && GripValue <= GripMax - FastStep) {
            GripValue += FastStep
            pins.servoWritePin(AnalogPin.P16, GripValue)
        }
    }
    timeOut += 1
    serial.writeString("baseValue: ")
    serial.writeNumber(BaseValue)
    serial.writeString(", leftValue: ")
    serial.writeNumber(LeftValue)
    serial.writeString(", rightValue: ")
    serial.writeNumber(RightValue)
    serial.writeString(", gripValue: ")
    serial.writeNumber(GripValue)
    serial.writeString(", RightY; ")
    serial.writeNumber(RightY)
    serial.writeString(", RightX; ")
    serial.writeNumber(RightX)
    serial.writeString(", timeOut; ")
    serial.writeNumber(timeOut)
    serial.writeLine(".")
    if (timeOut > 200) {
        pins.servoSetPulse(AnalogPin.P13, 0)
        pins.servoSetPulse(AnalogPin.P14, 0)
        pins.servoSetPulse(AnalogPin.P15, 0)
        pins.servoSetPulse(AnalogPin.P15, 0)
    }
})
