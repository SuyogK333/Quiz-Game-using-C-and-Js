using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace TriviaBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TriviaController : ControllerBase
    {
        private static List<Question> questions = new List<Question>
        {
            new Question { Text = "What is the capital of France?", Answer = "Paris" },
            new Question { Text = "Originally, Amazon only sold what kind of product?", Answer = "Books" },
            new Question { Text = "When did Facebook first launch?", Answer = "2004" },
            new Question { Text = "What does SPF in sunscreen stand for?", Answer = "Sun Protection Factor" },
            new Question { Text = "In what year was the internet opened to the public?", Answer = "1993" },
            new Question { Text = "What is the largest planet?", Answer = "Jupiter" }
        };

        private static int currentScore = 0;

        [HttpGet("question/{index}")]
        public IActionResult GetQuestion(int index)
        {
            if (index >= 0 && index < questions.Count)
            {
                return Ok(questions[index]);
            }
            return NotFound(new { message = "No more questions available!" });
        }

        [HttpPost("answer")]
        public IActionResult SubmitAnswer([FromBody] AnswerSubmission submission)
        {
            var correctAnswer = questions[submission.QuestionIndex].Answer;
            if (submission.Answer.ToLower() == correctAnswer.ToLower())
            {
                currentScore++;
                return Ok(new { message = "Correct!", score = currentScore });
            }
            else
            {
                return Ok(new { message = "Incorrect", score = currentScore });
            }
        }
    }

public class Question
{
    public string Text { get; set; } = string.Empty;  // Ensure it's initialized
    public string Answer { get; set; } = string.Empty;  // Ensure it's initialized

    public Question()
    {
        Text = string.Empty;
        Answer = string.Empty;
    }
}


  public class AnswerSubmission
{
    public int QuestionIndex { get; set; }
    public string Answer { get; set; } = string.Empty; // Initialize Answer
}


}
