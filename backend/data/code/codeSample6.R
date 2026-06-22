library(shiny)

ui <- fluidPage(
  titlePanel("Distribusi Peluang"),
  
  sidebarLayout(
    sidebarPanel(
      selectInput(
        "distribution", 
        "Pilih Distribusi:", 
        choices = c("Binomial", "Poisson", "Normal"),
        selected = "Binomial"
      ),
      conditionalPanel(
        condition = "input.distribution == 'Binomial'",
        numericInput("size_binom", "Jumlah Percobaan (n):", 10, min = 1),
        numericInput("prob_binom", "Peluang Sukses (p):", 0.5, min = 0, max = 1, step = 0.01),
        sliderInput("x_binom", "Nilai x:", min = 0, max = 10, value = 5)
      ),
      conditionalPanel(
        condition = "input.distribution == 'Poisson'",
        numericInput("lambda_pois", "Rata-rata (λ):", 5, min = 0, step = 0.1),
        sliderInput("x_pois", "Nilai x:", min = 0, max = 20, value = 5)
      ),
      conditionalPanel(
        condition = "input.distribution == 'Normal'",
        numericInput("mean_norm", "Rata-rata (μ):", 0),
        numericInput("sd_norm", "Standar Deviasi (σ):", 1, min = 0.1),
        sliderInput("x_norm", "Nilai x:", min = -5, max = 5, value = c(-1, 1))
      )
    ),
    
    mainPanel(
      conditionalPanel(
        condition = "input.distribution == 'Binomial'",
        plotOutput("binom_plot"),
        verbatimTextOutput("binom_output")
      ),
      conditionalPanel(
        condition = "input.distribution == 'Poisson'",
        plotOutput("pois_plot"),
        verbatimTextOutput("pois_output")
      ),
      conditionalPanel(
        condition = "input.distribution == 'Normal'",
        plotOutput("norm_plot"),
        verbatimTextOutput("norm_output")
      )
    )
  )
)

server <- function(input, output) {
  
  # Binomial
  output$binom_plot <- renderPlot({
    x <- 0:input$size_binom
    y <- dbinom(x, size = input$size_binom, prob = input$prob_binom)
    barplot(y, names.arg = x, col = "#00726B", main = "Distribusi Binomial",
            xlab = "x", ylab = "Probabilitas")
  })
  
  output$binom_output <- renderText({
    p <- dbinom(input$x_binom, size = input$size_binom, prob = input$prob_binom)
    paste0("P(X = ", input$x_binom, ") = ", round(p, 4))
  })
  
  # Poisson
  output$pois_plot <- renderPlot({
    x <- 0:20
    y <- dpois(x, lambda = input$lambda_pois)
    barplot(y, names.arg = x, col = "#00726B", main = "Distribusi Poisson",
            xlab = "x", ylab = "Probabilitas")
  })
  
  output$pois_output <- renderText({
    p <- dpois(input$x_pois, lambda = input$lambda_pois)
    paste0("P(X = ", input$x_pois, ") = ", round(p, 4))
  })
  
  # Normal
  output$norm_plot <- renderPlot({
    x <- seq(-5, 5, length.out = 100)
    y <- dnorm(x, mean = input$mean_norm, sd = input$sd_norm)
    plot(x, y, type = "l", lwd = 2, col = "#38B68D", main = "Distribusi Normal",
         xlab = "x", ylab = "Kepadatan")
    abline(v = input$x_norm, col = "#38B68D", lty = 2)
    polygon(c(input$x_norm[1], seq(input$x_norm[1], input$x_norm[2], length.out = 100), input$x_norm[2]),
            c(0, dnorm(seq(input$x_norm[1], input$x_norm[2], length.out = 100), mean = input$mean_norm, sd = input$sd_norm), 0),
            col = "#00726B", border = NA)
  })
  
  output$norm_output <- renderText({
    prob <- pnorm(input$x_norm[2], mean = input$mean_norm, sd = input$sd_norm) - 
      pnorm(input$x_norm[1], mean = input$mean_norm, sd = input$sd_norm)
    paste0("P(", input$x_norm[1], " < X < ", input$x_norm[2], ") = ", round(prob, 4))
  })
  
}

shinyApp(ui, server)
