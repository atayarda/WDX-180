// YOUR CODE HERE >>

let answer = prompt("Question: Who created JavaScript?\n\nA) Brendan Eich\nB) Bill Gates\nC) Mark Zuckerberg\n\nPlease select the correct option (A, B, or C).").trim().toUpperCase()
if(answer == "A"){
    alert("Correct! Not only did he create JS, the prototype of the language was ready in 10 days!")
}else if (answer == "B") {
    alert("Nope. He lead the development of the Windows Operating System.")
}else if (answer == "C"){
    alert("Nope. He just came up with the idea for a social network idea.")
} else {
    alert("Your answer is not a valid answer, options are (A, B, or C).")
}
  // << YOUR CODE HERE