library(shiny)

# Define UI
ui <- fluidPage(
  titlePanel("Pengujian Hipotesis: Satu Sampel & Dua Sampel"),
  sidebarLayout(
    sidebarPanel(
      selectInput(
        "test_type",
        "Pilih Jenis Uji:",
        choices = c("Uji-z Satu Sampel", "Uji-t Satu Sampel", "Uji Dua Sampel", "Uji Berpasangan"),
        selected = "Uji-z Satu Sampel"
      ),
      conditionalPanel(
        condition = "input.test_type == 'Uji-z Satu Sampel' || input.test_type == 'Uji-t Satu Sampel'",
        numericInput("mu", "Hipotesis Nilai Rata-rata (μ):", value = 160),
        textInput("sample_data", "Masukkan Sampel (Pisahkan dengan koma):", "171, 173, 160, 162, 155, 159, 160, 163, 165, 159"),
        numericInput("alpha", "Taraf Signifikansi (α):", value = 0.05, step = 0.01)
      ),
      conditionalPanel(
        condition = "input.test_type == 'Uji Dua Sampel'",
        textInput("sample_data_1", "Masukkan Sampel 1 (Pisahkan dengan koma):", "171, 173, 160, 162, 155, 159, 160, 163, 165, 159"),
        textInput("sample_data_2", "Masukkan Sampel 2 (Pisahkan dengan koma):", "151, 153, 150, 155, 152, 154, 158, 157, 160, 153"),
        numericInput("alpha_two", "Taraf Signifikansi (α):", value = 0.05, step = 0.01),
        checkboxInput("equal_var", "Asumsikan Varians Sama?", value = TRUE)
      ),
      conditionalPanel(
        condition = "input.test_type == 'Uji Berpasangan'",
        textInput("paired_before", "Masukkan Data Sebelum (Pisahkan dengan koma):", "24, 19, 25, 22, 29, 30, 21, 26, 35, 27"),
        textInput("paired_after", "Masukkan Data Setelah (Pisahkan dengan koma):", "25, 20, 26, 23, 30, 31, 22, 27, 36, 28"),
        numericInput("alpha_paired", "Taraf Signifikansi (α):", value = 0.05, step = 0.01)
      ),
      actionButton("run_test", "Jalankan Uji")
    ),
    mainPanel(
      h4("Hasil Uji:"),
      verbatimTextOutput("test_result")
    )
  )
)

# Define Server
server <- function(input, output) {
  observeEvent(input$run_test, {
    if (input$test_type == "Uji-z Satu Sampel" || input$test_type == "Uji-t Satu Sampel") {
      sample_data <- as.numeric(unlist(strsplit(input$sample_data, ",")))
      mu <- input$mu
      alpha <- input$alpha
      sample_mean <- mean(sample_data)
      sample_sd <- sd(sample_data)
      n <- length(sample_data)
      
      if (input$test_type == "Uji-z Satu Sampel") {
        z_value <- (sample_mean - mu) / (sample_sd / sqrt(n))
        p_value <- 2 * pnorm(-abs(z_value))
        decision <- ifelse(p_value < alpha, "Tolak H0", "Gagal Tolak H0")
        result <- paste0(
          "Z-hitung: ", round(z_value, 3),
          "\nP-value: ", round(p_value, 3),
          "\nKeputusan: ", decision
        )
      } else {
        t_test <- t.test(sample_data, mu = mu, conf.level = 1 - alpha)
        result <- paste0(
          "T-hitung: ", round(t_test$statistic, 3),
          "\nP-value: ", round(t_test$p.value, 3),
          "\nKeputusan: ", ifelse(t_test$p.value < alpha, "Tolak H0", "Gagal Tolak H0")
        )
      }
      
      output$test_result <- renderText({ result })
    }
    
    if (input$test_type == "Uji Dua Sampel") {
      sample_data_1 <- as.numeric(unlist(strsplit(input$sample_data_1, ",")))
      sample_data_2 <- as.numeric(unlist(strsplit(input$sample_data_2, ",")))
      alpha <- input$alpha_two
      equal_var <- input$equal_var
      
      t_test <- t.test(sample_data_1, sample_data_2, var.equal = equal_var, conf.level = 1 - alpha)
      result <- paste0(
        "T-hitung: ", round(t_test$statistic, 3),
        "\nP-value: ", round(t_test$p.value, 3),
        "\nKeputusan: ", ifelse(t_test$p.value < alpha, "Tolak H0", "Gagal Tolak H0")
      )
      
      output$test_result <- renderText({ result })
    }
    
    if (input$test_type == "Uji Berpasangan") {
      paired_before <- as.numeric(unlist(strsplit(input$paired_before, ",")))
      paired_after <- as.numeric(unlist(strsplit(input$paired_after, ",")))
      
      # Validasi jumlah data
      if (length(paired_before) != length(paired_after)) {
        result <- "Error: Jumlah data sebelum dan sesudah harus sama."
      } else if (length(paired_before) < 2) {
        result <- "Error: Data terlalu sedikit untuk melakukan uji berpasangan."
      } else {
        alpha <- input$alpha_paired
        t_test <- t.test(paired_before, paired_after, paired = TRUE, conf.level = 1 - alpha)
        result <- paste0(
          "T-hitung: ", round(t_test$statistic, 3),
          "\nP-value: ", round(t_test$p.value, 3),
          "\nKeputusan: ", ifelse(t_test$p.value < alpha, "Tolak H0", "Gagal Tolak H0")
        )
      }
      output$test_result <- renderText({ result })
    }
  })
}

# Run the application 
shinyApp(ui = ui, server = server)
