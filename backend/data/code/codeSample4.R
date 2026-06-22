library(shiny)

ui <- fluidPage(
  titlePanel("Statistika Deskriptif: Ukuran Pemusatan dan Penyebaran Data"),
  
  sidebarLayout(
    sidebarPanel(
      h4("Masukkan Data Anda:"),
      textAreaInput(
        inputId = "data_input", 
        label = "Masukkan data (pisahkan dengan koma atau spasi):", 
        placeholder = "Contoh: 700, 600, 725, 500"
      ),
      actionButton("process", "Proses Data"),
      br(),
      h4("Pilihan Analisis:"),
      checkboxGroupInput(
        inputId = "stats_options", 
        label = "Pilih ukuran statistik yang ingin dihitung:",
        choices = c("Mean" = "mean", 
                    "Median" = "median", 
                    "Modus" = "mode", 
                    "Range" = "range", 
                    "Varians" = "var", 
                    "Standar Deviasi" = "sd", 
                    "Kuartil" = "quantiles", 
                    "Ringkasan Statistik" = "summary"),
        selected = c("mean", "median", "summary")
      )
    ),
    
    mainPanel(
      h3("Hasil Analisis:"),
      tableOutput("results"),
      br(),
      h3("Visualisasi Data:"),
      plotOutput("data_plot")
    )
  )
)

server <- function(input, output) {
  observeEvent(input$process, {
    # Proses data input
    data <- reactive({
      req(input$data_input)
      as.numeric(unlist(strsplit(input$data_input, "[,\\s]+")))
    })
    
    # Hitung ukuran statistik
    results <- reactive({
      req(data())
      stats <- list()
      
      if ("mean" %in% input$stats_options) stats$Mean <- mean(data())
      if ("median" %in% input$stats_options) stats$Median <- median(data())
      if ("mode" %in% input$stats_options) {
        mode_calc <- table(data())
        stats$Modus <- names(mode_calc[mode_calc == max(mode_calc)])
      }
      if ("range" %in% input$stats_options) stats$Range <- range(data())
      if ("var" %in% input$stats_options) stats$Varians <- var(data())
      if ("sd" %in% input$stats_options) stats$`Standar Deviasi` <- sd(data())
      if ("quantiles" %in% input$stats_options) stats$Kuartil <- quantile(data())
      if ("summary" %in% input$stats_options) stats$Ringkasan <- summary(data())
      
      return(stats)
    })
    
    # Output hasil
    output$results <- renderTable({
      req(results())
      do.call(rbind, results())
    }, rownames = TRUE)
    
    # Visualisasi data
    output$data_plot <- renderPlot({
      req(data())
      hist(data(), 
           main = "Histogram Data", 
           xlab = "Nilai Data", 
           col = "skyblue", 
           border = "white")
    })
  })
}

shinyApp(ui = ui, server = server)
