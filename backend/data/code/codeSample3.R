library(shiny)

# Data sampel
moore_travel_data <- c(77, 18, 63, 84, 38, 54, 50, 59, 54, 56,
                       36, 26, 50, 34, 44, 41, 58, 58, 53, 51,
                       62, 43, 52, 53, 63, 62, 62, 65, 61, 52,
                       60, 60, 45, 66, 83, 71, 63, 58, 61, 71)

southern_phone_data <- c(52, 43, 30, 38, 30, 42, 12, 46,
                         39, 37, 34, 46, 32, 18, 41, 5)

ui <- fluidPage(
  titlePanel("Penyajian Data Statistik"),
  sidebarLayout(
    sidebarPanel(
      selectInput("dataset", "Pilih Dataset:", 
                  choices = c("Moore Travel Agency" = "moore",
                              "Southern Phone Company" = "southern")),
      radioButtons("plotType", "Pilih Jenis Plot:", 
                   choices = c("Histogram", "Boxplot", "Stem-and-Leaf")),
      checkboxInput("showSummary", "Tampilkan Statistik Deskriptif", FALSE)
    ),
    mainPanel(
      plotOutput("mainPlot"),
      verbatimTextOutput("summaryOutput"),
      verbatimTextOutput("stemOutput")
    )
  )
)

server <- function(input, output) {
  data <- reactive({
    if (input$dataset == "moore") {
      moore_travel_data
    } else {
      southern_phone_data
    }
  })
  
  output$mainPlot <- renderPlot({
    req(data())
    if (input$plotType == "Histogram") {
      hist(data(), main = "Histogram", xlab = "Nilai", col = "#00726B", border = "white")
    } else if (input$plotType == "Boxplot") {
      boxplot(data(), main = "Boxplot", horizontal = TRUE, col = "#00726B")
    }
  })
  
  output$summaryOutput <- renderPrint({
    req(input$showSummary)
    summary(data())
  })
  
  output$stemOutput <- renderPrint({
    req(input$plotType == "Stem-and-Leaf")
    stem(data())
  })
}

shinyApp(ui = ui, server = server)
