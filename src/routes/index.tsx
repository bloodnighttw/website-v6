import { Counter } from "../counter"

export default async function Index({path} : {path: string}){
    return <>
        <div>hi from {path}</div>
        <Counter />
    </>
}

export const config = ()=>{

}