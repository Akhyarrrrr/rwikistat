library(shiny)

# Define UI
ui <- fluidPage(
  titlePanel("Pendugaan Selang Kepercayaan"),
  
  sidebarLayout(
    sidebarPanel(
      h3("Masukkan Data"),
      textInput("data", "Data (pisahkan dengan koma):", 
                placeholder = "Contoh: 22, 41, 35, 45"),
      numericInput("confidence", "Tingkat Kepercayaan (%)", 95, min = 50, max = 99),
      numericInput("sigma", "Standar Deviasi Populasi (σ) (opsional):", NA, min = 0, step = 0.01),
      actionButton("calculate", "Hitung Selang Kepercayaan")
    ),
    
    mainPanel(
      h3("Hasil"),
      verbatimTextOutput("ci_output"),
      h3("Plot Distribusi"),
      plotOutput("distribution_plot")
    )
  )
)

# Define Server
server <- function(input, output) {
  observeEvent(input$calculate, {
    req(input$data)
    
    # Parsing the data input
    data <- as.numeric(unlist(strsplit(input$data, ",")))
    confidence <- input$confidence / 100
    sigma <- ifelse(is.na(input$sigma), NULL, input$sigma)
    
    # Validasi data
    if (length(data) < 2) {
      output$ci_output <- renderText("Masukkan setidaknya dua data.")
      return(NULL)
    }
    
    # Perhitungan
    n <- length(data)
    xbar <- mean(data)
    s <- sd(data)
    alpha <- 1 - confidence
    
    if (is.null(sigma)) {
      # Jika σ tidak diketahui, gunakan distribusi t
      t_val <- qt(1 - alpha / 2, df = n - 1)
      error_margin <- t_val * (s / sqrt(n))
      method <- "Distribusi t (σ tidak diketahui)"
    } else {
      # Jika σ diketahui, gunakan distribusi normal
      z_val <- qnorm(1 - alpha / 2)
      error_margin <- z_val * (sigma / sqrt(n))
      method <- "Distribusi Normal (σ diketahui)"
    }
    
    # Hasil
    lower_bound <- xbar - error_margin
    upper_bound <- xbar + error_margin
    output$ci_output <- renderText({
      paste0(
        "Metode: ", method, "\n",
        "Mean: ", round(xbar, 2), "\n",
        "Selang Kepercayaan (", input$confidence, "%): [", 
        round(lower_bound, 2), ", ", round(upper_bound, 2), "]"
      )
    })
    
    # Plot distribusi
    output$distribution_plot <- renderPlot({
      x <- seq(xbar - 4 * s, xbar + 4 * s, length.out = 1000)
      y <- dnorm(x, mean = xbar, sd = ifelse(is.null(sigma), s / sqrt(n), sigma / sqrt(n)))
      plot(x, y, type = "l", lwd = 2, col = "blue", 
           main = "Distribusi Sampling Mean",
           xlab = "Nilai", ylab = "Kepadatan")
      abline(v = c(lower_bound, upper_bound), col = "red", lty = 2)
      abline(v = xbar, col = "green", lwd = 2)
      legend("topright", legend = c("Rata-rata", "Batas Kepercayaan"),
             col = c("green", "red"), lty = c(1, 2), lwd = c(2, 2))
    })
  })
}

# Run App
shinyApp(ui, server)
