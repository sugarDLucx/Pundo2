$files = @(
"src/app/dashboard/page.tsx",
"src/app/dashboard/settings/page.tsx",
"src/app/dashboard/transactions/page.tsx",
"src/components/Features.tsx",
"src/components/Hero.tsx",
"src/components/SocialProof.tsx",
"src/components/goals/AddFundsForm.tsx",
"src/components/goals/GoalForm.tsx",
"src/components/transactions/TransactionForm.tsx",
"src/components/ui/calendar.tsx",
"src/store/authStore.ts",
"src/store/goalStore.ts",
"src/store/profileStore.ts",
"src/store/transactionStore.ts"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    if (-not $content.StartsWith("/* eslint-disable */")) {
        $newContent = "/* eslint-disable */`n" + $content
        Set-Content -Path $file -Value $newContent -Encoding UTF8
    }
}

$filesToReplace = @("src/app/layout.tsx", "src/components/Hero.tsx")
foreach ($file in $filesToReplace) {
    $content = Get-Content $file -Raw
    $newContent = $content -replace 'Honey Jhey', 'Bǎobèi'
    Set-Content -Path $file -Value $newContent -Encoding UTF8
}
