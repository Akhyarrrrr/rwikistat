library(shiny)

# Define UI
ui <- fluidPage(
  titlePanel("Pengenalan R dan RStudio"),
  
  sidebarLayout(
    sidebarPanel(
      selectInput("dataset", "Pilih Dataset:", 
                  choices = c("Contoh Data Tinggi dan Berat", "Data Acak")),
      
      conditionalPanel(
        condition = "input.dataset == 'Contoh Data Tinggi dan Berat'",
        h4("Masukkan Data Berat dan Tinggi:"),
        textInput("weights", "Berat (kg):", "60, 72, 57, 90, 95, 72"),
        textInput("heights", "Tinggi (m):", "1.75, 1.80, 1.65, 1.90, 1.74, 1.91"),
        actionButton("calculate", "Hitung IMT")
      ),
      
      conditionalPanel(
        condition = "input.dataset == 'Data Acak'",
        sliderInput("n_samples", "Jumlah Sampel:", min = 10, max = 1000, value = 100)
      )
    ),
    
    mainPanel(
      tabsetPanel(
        tabPanel("Deskripsi Data", verbatimTextOutput("summary")),
        tabPanel("Perhitungan", verbatimTextOutput("calculations")),
        tabPanel("Plot", plotOutput("plot"))
      )
    )
  )
)

# Define Server
server <- function(input, output) {
  
  reactive_data <- reactive({
    if (input$dataset == "Contoh Data Tinggi dan Berat") {
      weights <- as.numeric(unlist(strsplit(input$weights, ",")))
      heights <- as.numeric(unlist(strsplit(input$heights, ",")))
      
      if (length(weights) == length(heights)) {
        data.frame(Weight = weights, Height = heights)
      } else {
        NULL
      }
    } else {
      data.frame(Value = rnorm(input$n_samples))
    }
  })
  
  output$summary <- renderPrint({
    data <- reactive_data()
    
    if (is.null(data)) {
      "Data tidak valid. Pastikan panjang berat dan tinggi sama."
    } else {
      summary(data)
    }
  })
  
  output$calculations <- renderPrint({
    data <- reactive_data()
    
    if (input$dataset == "Contoh Data Tinggi dan Berat" && !is.null(data)) {
      imt <- data$Weight / (data$Height^2)
      list(
        "IMT" = imt,
        "Mean IMT" = mean(imt),
        "SD IMT" = sd(imt)
      )
    } else {
      "Tidak ada perhitungan untuk data acak."
    }
  })
  
  output$plot <- renderPlot({
    data <- reactive_data()
    
    if (input$dataset == "Contoh Data Tinggi dan Berat" && !is.null(data)) {
      plot(data$Height, data$Weight,
           main = "Plot Tinggi vs Berat",
           xlab = "Tinggi (m)",
           ylab = "Berat (kg)",
           pch = 19, col = "blue")
    } else {
      hist(data$Value,
           main = "Histogram Data Acak",
           xlab = "Nilai", col = "#00726B")
    }
  })
}

# Run the app
shinyApp(ui = ui, server = server)
