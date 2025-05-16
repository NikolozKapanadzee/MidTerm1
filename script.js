#!/usr/bin/env node

// You're task is to build expense-cli using commander and fs module.
// 1) You should have CRUD - craete, read, update, delete, getById functionality.
// Each expense should have minimum 4 field, category, price, id, createdAt this is requied, you should also add other fields its depends on you.
// 2) When you create new expense system itself should set createdAt prop, accordingly  when you run expense-cli show --asc or --desc it should return sorted expenses by createdAt prop. 
// 3) Add filters expense-cli show -c or --category shopping, should returns all expenses which categories are shopping.
// 4) You should add search by date functionality. expense-cli search 2025-01-02 should return all expenses from 2025 Jan 2.
// 5) You should have validation each expense creation time, like if expense is less than 10 throw some error. 


import { Command } from 'commander';
import { readFile, writeFile } from './utils.js';


const program = new Command();


program
    .name("expences cli tool")
    .description("simple expences crud")
    .version("1.0.0")
program
    .command("show")
    .option("-a, --asc")
    .option("-d, --desc")
    .option("-c, --category <category>")
    .action(async (opts) => {
        const expences = await readFile("expences.json", true)
       if (!expences) {
        console.log("expences list is empty");
        return
       }
       if (opts.asc) {
        console.log(expences.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
       }
       if (opts.desc) {
        console.log(expences.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
       }
       console.log(expences.filter(expenc => expenc.category === opts.category));
    })
program
    .command("add")
    .argument("<category>")
    .argument("<price>")
    .action(async (category, price) => {
        const expences = await readFile("expences.json", true)
        const lastId = expences[expences.length - 1]?.id || 0
        const newExpense = {
            id: lastId + 1,
            category,
            price: Number(price),
            createdAt: new Date().toISOString()
        }
        expences.push(newExpense)
        await writeFile("expences.json", JSON.stringify(expences))
        console.log(expences);
    })
program
    .command("delete")
    .argument("<id>")
    .action(async (id) => {
        const expences = await readFile("expences.json", true)
        const index = expences.findIndex(el => el.id === Number(id))
        if (index === -1) {
            console.log("item does not exit on this id");
            return
        }
        const deletedItem = expences.splice(index, 1);
        await writeFile("expences.json", JSON.stringify(expences))
        console.log(`deleted: ${JSON.stringify(deletedItem)}`);
    })
program
    .command("update")
    .argument("<id>")
    .option("-p, --price <price>")
    .option("-c, --category <category>")
    .action(async (id,opts) => {
       const expences = await readFile("expences.json", true)
        const index = expences.findIndex(el => el.id === Number(id))
        if (index === -1) {
            console.log("item does not exit on this id");
            return
        }
         if (opts.price) {
            opts.price = Number(opts.price) 
        }
        expences[index] = {
            ...expences[index],
            ...opts
        }
        await writeFile("expences.json", JSON.stringify(expences))
        console.log(`updated : ${JSON.stringify(expences[index])}`);
    })
program.parse();