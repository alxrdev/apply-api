import { Equals, IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator"

import validateClassParameters from "@utils/validateClassParameters"
import { AppError } from "@errors/index"

class TestableObject {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    public name !: string

    @IsDefined()
    @IsNumber()
    @Equals(2)
    public numberTwo !: number
}

describe('Test the validate class parameter util function', () => {
    it ('Should throw a AppError if the object property values is invalid', async () => {
        const testObj = new TestableObject()
        testObj.name != undefined
        testObj.numberTwo = 10

        await expect(validateClassParameters(testObj)).rejects.toThrowError(AppError)
    })

    it ('Should return an array with objects inside the errorDetails property in AppError', async () => {
        const testObj = new TestableObject()
        testObj.name != undefined
        testObj.numberTwo = 10

        async function validate() {
            try {
                await validateClassParameters(testObj)
            } catch (e) {
                return e.errorDetails.length
            }
        }

        await expect(validate()).resolves.toBe(2)
    })

    it ('Should return an array with an objects inside the errorDetails property in AppError', async () => {
        const testObj = new TestableObject()
        testObj.name = 'Alex'
        testObj.numberTwo = 10

        async function validate() {
            try {
                await validateClassParameters(testObj)
            } catch (e) {
                return Object.keys(e.errorDetails[0])
            }
        }

        await expect(validate()).resolves.toEqual(expect.arrayContaining(['property', 'value', 'constraints']))
    })
})
