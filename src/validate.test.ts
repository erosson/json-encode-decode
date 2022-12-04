import * as V from './validate'

test("validate string", () => {
    expect(V.string.validate("foo")).toBeNull()
    expect(V.string.validate(3)).toMatchObject({ error: { codecErr: "expectedType" }, path: [] })
})
test("validate number", () => {
    expect(V.number.validate(3)).toBeNull()
    expect(V.number.validate(0)).toBeNull()
    expect(V.number.validate(NaN)).toBeNull()
    expect(V.number.validate("foo")).toMatchObject({ error: { codecErr: "expectedType" }, path: [] })
})
test("validate boolean", () => {
    expect(V.boolean.validate(true)).toBeNull()
    expect(V.boolean.validate(false)).toBeNull()
    expect(V.boolean.validate(null)).toMatchObject({ error: { codecErr: "expectedType" }, path: [] })
})
test("validate null", () => {
    expect(V.null_.validate(null)).toBeNull()
    expect(V.null_.validate(false)).toMatchObject({ error: { codecErr: "expectedType" }, path: [] })
})
test("validate nullable", () => {
    expect(V.number.nullable().validate(null)).toBeNull()
    expect(V.number.nullable().validate(3)).toBeNull()
    expect(V.number.nullable().validate("three")).toMatchObject({ error: { codecErr: "oneOf" }, path: [] })
})
test("validate array", () => {
    expect(V.number.array().validate([])).toBeNull()
    expect(V.number.array().validate([3])).toBeNull()
    expect(V.number.array().validate([3, 4, 5])).toBeNull()
    expect(V.number.array().validate("three")).toMatchObject({ error: { codecErr: "expectedType", expected: 'array' }, path: [] })
    expect(V.number.array().validate(["three"])).toMatchObject({ error: { codecErr: "expectedType", expected: 'number' }, path: [0] })
    expect(V.number.array().validate([3, 4, "five"])).toMatchObject({ error: { codecErr: "expectedType", expected: 'number' }, path: [2] })

    expect(V.number.nullable().array().validate([3, 4, 5, null])).toBeNull()
    expect(V.number.array().nullable().validate([3, 4, 5, null])).toMatchObject({ error: { codecErr: "oneOf" } })
    expect(V.number.nullable().array().validate(null)).toMatchObject({ error: { codecErr: "expectedType", expected: 'array' }, path: [], value: null })
    expect(V.number.array().nullable().validate(null)).toBeNull()
})
// test("decode dict", () => {
//     expect(D.number.dict().decodeValue({})).toEqual({})
//     expect(D.number.dict().decodeValue({ three: 3 })).toEqual({ three: 3 })
//     expect(D.number.dict().decodeValue({ three: 3, four: 4 })).toEqual({ three: 3, four: 4 })
//     expect(() => D.number.dict().decodeValue("three")).toThrow("Expecting an OBJECT")
//     expect(() => D.number.dict().decodeValue({ three: "three" })).toThrow("Expecting a NUMBER")
//     expect(() => D.number.dict().decodeValue({ three: 3, four: "four" })).toThrow("Expecting a NUMBER")
// 
// 
//     expect(D.number.nullable().dict().decodeValue({ a: 3, b: null })).toEqual({ a: 3, b: null })
//     expect(() => D.number.dict().nullable().decodeValue({ a: 3, b: null })).toThrow()
//     expect(() => D.number.nullable().dict().decodeValue(null)).toThrow()
//     expect(D.number.dict().nullable().decodeValue(null)).toEqual(null)
// })
// test("decode field", () => {
//     expect(() => D.number.field("key").decodeValue(99)).toThrow("Expecting an OBJECT")
//     expect(() => D.number.field("key").decodeValue([99])).toThrow("Expecting an OBJECT")
//     expect(() => D.number.field("key").decodeValue({ key: "oof" })).toThrow("Expecting a NUMBER")
//     expect(() => D.number.field("key").decodeValue({})).toThrow("Missing key")
//     expect(D.number.field("key")['decoderFn']({ key: "oof" })).toMatchObject({ error: { path: ["key"] } })
//     expect(D.number.field("two").field("key")['decoderFn']({ key: { two: "oof" } })).toMatchObject({ error: { path: ["key", "two"] } })
// })
// test("decode index", () => {
//     expect(D.number.index(0).decodeValue([10, 11, 12])).toBe(10)
//     expect(D.number.index(0).decodeValue([10, 11, 12])).toBe(10)
//     expect(D.number.index(1).decodeValue([10, 11, 12])).toBe(11)
//     expect(() => D.number.index(0).decodeValue(10)).toThrow("Expecting an ARRAY")
//     expect(() => D.number.index(0).decodeValue({ key: 10 })).toThrow("Expecting an ARRAY")
//     expect(() => D.number.index(0).decodeValue(["oof"])).toThrow("Expecting a NUMBER")
//     expect(() => D.number.index(0).decodeValue([])).toThrow("Missing key")
//     expect(D.number.index(0)['decoderFn'](["oof"])).toMatchObject({ error: { path: [0] } })
//     expect(D.number.index(1).index(0)['decoderFn']([["oof", "oof"]])).toMatchObject({ error: { path: [0, 1] } })
// })
// test("decode get", () => {
//     expect(D.number.get(0).decodeValue([10, 11, 12])).toBe(10)
//     expect(D.number.get("key").decodeValue({ key: 99 })).toBe(99)
//     expect(() => D.number.get(0).decodeValue({ key: 99 })).toThrow("Expecting an ARRAY")
//     expect(() => D.number.get("key").decodeValue([10, 11, 12])).toThrow("Expecting an OBJECT")
//     expect(D.number.get(0)['decoderFn'](["oof"])).toMatchObject({ error: { path: [0] } })
// })
// test("decode at", () => {
//     expect(D.number.at([]).decodeValue(10)).toBe(10)
//     expect(D.number.at([0]).decodeValue([10])).toBe(10)
//     expect(D.number.at([0, 0]).decodeValue([[10]])).toBe(10)
//     expect(D.number.at([1, 0]).decodeValue([11, [10]])).toBe(10)
//     expect(D.number.at([1, 1]).decodeValue([11, [12, 10]])).toBe(10)
//     expect(D.number.at([0, "key"]).decodeValue([{ key: 10 }])).toBe(10)
//     expect(D.number.at(["key", 0]).decodeValue({ key: [10] })).toBe(10)
//     expect(() => D.number.at([]).decodeValue("ten")).toThrow("Expecting a NUMBER")
//     expect(() => D.number.at([0]).decodeValue([])).toThrow("Missing key")
//     expect(() => D.number.at([0]).decodeValue({ key: "oof" })).toThrow("Expecting an ARRAY")
//     expect(() => D.number.at(["key"]).decodeValue([10])).toThrow("Expecting an OBJECT")
//     expect(D.number.at([0])['decoderFn'](["oof"])).toMatchObject({ error: { path: [0] } })
//     expect(D.number.at(["key", 0])['decoderFn']({ key: ["oof"] })).toMatchObject({ error: { path: ["key", 0] } })
//     expect(D.number.at([0, "key"])['decoderFn']([{ key: "oof" }])).toMatchObject({ error: { path: [0, "key"] } })
//     expect(D.number.at([0, "key", "oof"])['decoderFn']([{ key: 10 }])).toMatchObject({ error: { path: [0, "key"] } })
// })
// test("decode succeed", () => {
//     expect(D.succeed(42).decodeValue(0)).toBe(42)
//     expect(D.succeed(42).decodeValue(null)).toBe(42)
//     expect(D.succeed(42).decodeValue("yay")).toBe(42)
//     expect(() => D.succeed(42).decodeString("oof")).toThrow(/Unexpected token o in JSON/)
// })
// test("decode fail", () => {
//     expect(() => D.fail("oops").decodeValue(0)).toThrow("oops")
//     expect(() => D.fail("oops").decodeValue(null)).toThrow("oops")
//     expect(() => D.fail("oops").decodeValue("yay")).toThrow("oops")
//     expect(() => D.succeed(42).decodeString("oof")).toThrow(/Unexpected token o in JSON/)
// })
// test("decode map", () => {
//     expect(D.string.map(s => s.length).decodeValue("yay")).toBe(3)
//     expect(D.string.map(s => s.length).decodeValue("yayay")).toBe(5)
// })
// test("decode andThen", () => {
//     function isThree(n: number): D.Decoder<string> {
//         return n === 3
//             ? D.succeed("n is exactly three")
//             : D.fail(`${n} is not three`)
//     }
//     expect(D.number.andThen(isThree).decodeValue(3)).toBe("n is exactly three")
//     expect(() => D.number.andThen(isThree).decodeValue(null)).toThrow("Expecting a NUMBER")
//     expect(() => D.number.andThen(isThree).decodeValue(true)).toThrow("Expecting a NUMBER")
//     expect(() => D.number.andThen(isThree).decodeValue("three")).toThrow("Expecting a NUMBER")
//     expect(() => D.number.andThen(isThree).decodeValue(6)).toThrow("6 is not three")
// })
// test("decode oneOf", () => {
//     expect(D.oneOf(D.number, D.succeed(-1)).decodeValue(3)).toBe(3)
//     expect(D.oneOf(D.number, D.succeed(-1)).decodeValue(9)).toBe(9)
//     expect(D.oneOf(D.number, D.succeed(-1)).decodeValue("three")).toBe(-1)
//     expect(D.oneOf(D.number, D.succeed(-1)).decodeValue(null)).toBe(-1)
//     expect(() => D.oneOf(D.number).decodeValue(null)).toThrow("Expecting a NUMBER")
//     // types prevent no-args oneOf
//     // expect(() => D.oneOf()).toThrow("oneOf needs at least one decoder")
// })
// test("decode maybe", () => {
//     const json = { name: "tom", age: 42 }
//     expect(D.number.field("age").maybe().decodeValue(json)).toBe(42)
//     expect(D.number.field("name").maybe().decodeValue(json)).toBe(null)
//     expect(D.number.field("height").maybe().decodeValue(json)).toBe(null)
//     expect(D.number.maybe().field("age").decodeValue(json)).toBe(42)
//     expect(D.number.maybe().field("name").decodeValue(json)).toBe(null)
//     expect(() => D.number.maybe().field("height").decodeValue(json)).toThrow("Missing key")
//     // default values
//     expect(D.number.field("age").maybe(3).decodeValue(json)).toBe(42)
//     expect(D.number.field("name").maybe(3).decodeValue(json)).toBe(3)
//     expect(D.number.field("height").maybe(3).decodeValue(json)).toBe(3)
// })
// test("decode nullAs", () => {
//     expect(D.nullAs(42).decodeValue(null)).toBe(42)
//     expect(() => D.nullAs(42).decodeValue("four")).toThrow("Expecting a NULL")
// })
// test("decode date", () => {
//     const now = new Date()
//     expect(D.date.decodeValue(now.getTime())).toStrictEqual(now)
//     expect(D.date.decodeValue(D.Encode.date(now))).toStrictEqual(now)
//     expect(D.date.decodeValue(1234)).toStrictEqual(new Date(1234))
// })
// 
// test("decode combined fields", () => {
//     type AB = { a: string, b: number }
//     // type can be inferred...
//     expect(D.combine({ a: D.string.field('a'), b: D.number.field('b') }).decodeValue({ a: 'yay', b: 3 })).toEqual({ a: 'yay', b: 3 })
//     // ...or explicit
//     expect(D.combine<AB>({ a: D.string.field('a'), b: D.number.field('b') }).decodeValue({ a: 'yay', b: 3 })).toEqual({ a: 'yay', b: 3 })
// 
//     expect(() => D.combine({ a: D.string.field('a'), b: D.number.field('b') }).decodeValue({ a: 'yay', c: 3 })).toThrow('Missing key')
// })
// 
// test("decode combined arrays", () => {
//     type AB = [string, number]
//     // type can be inferred...
//     expect(D.combine([D.string.field('a'), D.number.field('b')]).decodeValue({ a: 'yay', b: 3 })).toEqual(['yay', 3])
//     // ...or explicit
//     expect(D.combine<AB>([D.string.field('a'), D.number.field('b')]).decodeValue({ a: 'yay', b: 3 })).toEqual(['yay', 3])
// 
//     expect(() => D.combine([D.string.field('a'), D.number.field('b')]).decodeValue({ a: 'yay', c: 3 })).toThrow('Missing key')
// })